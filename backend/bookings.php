<?php
header('Content-Type: application/json; charset=utf-8');
mb_internal_encoding('UTF-8');
require_once 'config.php';

error_reporting(E_ALL);
ini_set('display_errors', 0);

try {
    $conn = getOracleConnection();
    
    $method = $_SERVER['REQUEST_METHOD'];
    
    switch ($method) {
        case 'GET':
            $date = $_GET['date'] ?? null;
            
            if ($date) {
                // GET /bookings?date=YYYY-MM-DD — rezervarile pentru o zi
                $sql = "SELECT b.id                                    AS booking_id,
                               TO_CHAR(b.booking_date, 'YYYY-MM-DD')  AS booking_date,
                               TO_CHAR(b.created_at,   'YYYY-MM-DD HH24:MI:SS') AS created_at,
                               u.id                                    AS user_id,
                               u.name                                  AS user_name,
                               u.email                                 AS user_email,
                               d.id                                    AS desk_id,
                               d.code                                  AS desk_code,
                               d.is_active                             AS desk_is_active
                        FROM   bookings b
                        JOIN   users    u ON u.id = b.user_id
                        JOIN   desks    d ON d.id = b.desk_id
                        WHERE  b.booking_date = TO_DATE(:date, 'YYYY-MM-DD')
                        ORDER  BY d.code ASC";
                
                $stmt = oci_parse($conn, $sql);
                oci_bind_by_name($stmt, ':date', $date);
                oci_execute($stmt);
                
                $bookings = [];
                while ($row = oci_fetch_assoc($stmt)) {
                    $bookings[] = [
                        'booking_id' => (int) $row['BOOKING_ID'],
                        'date'       => $row['BOOKING_DATE'],
                        'created_at' => $row['CREATED_AT'],
                        'user' => [
                            'id'    => (int) $row['USER_ID'],
                            'name'  => $row['USER_NAME'],
                            'email' => $row['USER_EMAIL']
                        ],
                        'desk' => [
                            'id'        => (int) $row['DESK_ID'],
                            'code'      => $row['DESK_CODE'],
                            'is_active' => (int) $row['DESK_IS_ACTIVE'] === 1
                        ]
                    ];
                }
                
                echo json_encode(['success' => true, 'data' => $bookings]);
                oci_free_statement($stmt);
                
            } else {
                // GET /bookings — toate rezervarile
                $sql = "SELECT b.id                                    AS booking_id,
                               TO_CHAR(b.booking_date, 'YYYY-MM-DD')  AS booking_date,
                               TO_CHAR(b.created_at,   'YYYY-MM-DD HH24:MI:SS') AS created_at,
                               u.id                                    AS user_id,
                               u.name                                  AS user_name,
                               u.email                                 AS user_email,
                               d.id                                    AS desk_id,
                               d.code                                  AS desk_code,
                               d.is_active                             AS desk_is_active
                        FROM   bookings b
                        JOIN   users    u ON u.id = b.user_id
                        JOIN   desks    d ON d.id = b.desk_id
                        ORDER  BY b.booking_date ASC, d.code ASC";
                
                $stmt = oci_parse($conn, $sql);
                oci_execute($stmt);
                
                $bookings = [];
                while ($row = oci_fetch_assoc($stmt)) {
                    $bookings[] = [
                        'booking_id' => (int) $row['BOOKING_ID'],
                        'date'       => $row['BOOKING_DATE'],
                        'created_at' => $row['CREATED_AT'],
                        'user' => [
                            'id'    => (int) $row['USER_ID'],
                            'name'  => $row['USER_NAME'],
                            'email' => $row['USER_EMAIL']
                        ],
                        'desk' => [
                            'id'        => (int) $row['DESK_ID'],
                            'code'      => $row['DESK_CODE'],
                            'is_active' => (int) $row['DESK_IS_ACTIVE'] === 1
                        ]
                    ];
                }
                
                echo json_encode(['success' => true, 'data' => $bookings]);
                oci_free_statement($stmt);
            }
            break;
            
        case 'POST':
            // POST /bookings — creaza o rezervare noua
            $input = json_decode(file_get_contents('php://input'), true);
            
            if (!isset($input['user_id']) || !isset($input['desk_id']) || !isset($input['date'])) {
                throw new Exception('Missing required fields: user_id, desk_id, date');
            }
            
            // Verificam daca biroul este activ
            $active_sql  = "SELECT is_active FROM desks WHERE id = :desk_id";
            $active_stmt = oci_parse($conn, $active_sql);
            oci_bind_by_name($active_stmt, ':desk_id', $input['desk_id']);
            oci_execute($active_stmt);
            
            $active_row = oci_fetch_assoc($active_stmt);
            oci_free_statement($active_stmt);
            
            if (!$active_row) {
                throw new Exception('Desk not found');
            }
            
            if ((int) $active_row['IS_ACTIVE'] !== 1) {
                throw new Exception('Desk is not available for booking');
            }
            
            // Verificam daca biroul e deja rezervat pentru data respectiva
            $check_sql  = "SELECT COUNT(*) AS cnt FROM bookings
                           WHERE  desk_id      = :desk_id
                           AND    booking_date = TO_DATE(:date, 'YYYY-MM-DD')";
            $check_stmt = oci_parse($conn, $check_sql);
            oci_bind_by_name($check_stmt, ':desk_id', $input['desk_id']);
            oci_bind_by_name($check_stmt, ':date',    $input['date']);
            oci_execute($check_stmt);
            
            $check_row = oci_fetch_assoc($check_stmt);
            oci_free_statement($check_stmt);
            
            if ((int) $check_row['CNT'] > 0) {
                throw new Exception('Desk is already booked for ' . $input['date']);
            }
            
            // Inseram rezervarea — ID generat automat de secventa Oracle
            $sql = "INSERT INTO bookings (user_id, desk_id, booking_date)
                    VALUES (:user_id, :desk_id, TO_DATE(:date, 'YYYY-MM-DD'))
                    RETURNING id INTO :new_id";
            
            $stmt   = oci_parse($conn, $sql);
            $new_id = 0;
            
            oci_bind_by_name($stmt, ':user_id', $input['user_id']);
            oci_bind_by_name($stmt, ':desk_id', $input['desk_id']);
            oci_bind_by_name($stmt, ':date',    $input['date']);
            oci_bind_by_name($stmt, ':new_id',  $new_id, 10, SQLT_INT);
            
            if (oci_execute($stmt, OCI_COMMIT_ON_SUCCESS)) {
                echo json_encode([
                    'success' => true,
                    'message' => 'Booking created successfully',
                    'data'    => [
                        'id'      => (int) $new_id,
                        'user_id' => (int) $input['user_id'],
                        'desk_id' => (int) $input['desk_id'],
                        'date'    => $input['date']
                    ]
                ]);
            } else {
                $e = oci_error($stmt);
                throw new Exception($e['message']);
            }
            
            oci_free_statement($stmt);
            break;
            
        case 'DELETE':
            // DELETE /bookings — sterge o rezervare
            $input = json_decode(file_get_contents('php://input'), true);
            
            if (!isset($input['id'])) {
                throw new Exception('Missing booking ID');
            }
            
            // Verificam daca rezervarea exista
            $check_sql  = "SELECT COUNT(*) AS cnt FROM bookings WHERE id = :id";
            $check_stmt = oci_parse($conn, $check_sql);
            oci_bind_by_name($check_stmt, ':id', $input['id']);
            oci_execute($check_stmt);
            
            $check_row = oci_fetch_assoc($check_stmt);
            oci_free_statement($check_stmt);
            
            if ((int) $check_row['CNT'] === 0) {
                throw new Exception('Booking not found');
            }
            
            $sql  = "DELETE FROM bookings WHERE id = :id";
            $stmt = oci_parse($conn, $sql);
            oci_bind_by_name($stmt, ':id', $input['id']);
            
            if (oci_execute($stmt, OCI_COMMIT_ON_SUCCESS)) {
                echo json_encode(['success' => true, 'message' => 'Booking deleted successfully']);
            } else {
                $e = oci_error($stmt);
                throw new Exception($e['message']);
            }
            
            oci_free_statement($stmt);
            break;
            
        default:
            throw new Exception('Invalid request method');
    }
    
    oci_close($conn);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>