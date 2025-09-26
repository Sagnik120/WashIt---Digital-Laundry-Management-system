import jwt from 'jsonwebtoken';
import db from '../config/database.js';
class userController{
    // Assuming userModal is your Mongoose model

static studentRegister = async (req, res) => {
    try {
        // 1. Destructure all required fields from the request body
        const { 
            fullName, 
            email, 
            rollNumber, 
            password, 
            confirmPassword, 
            hostelName, 
            roomNumber,
            phoneNumber,
            departmentName,
            passingYear,
            profilePicture,
            laundryId
        } = req.body;
        

        // 2. Check if all REQUIRED fields are provided
        if (fullName && email && password && confirmPassword && rollNumber) {
            
            // 3. Check if password and confirm password match
            if (password !== confirmPassword) {
                return res.status(400).send({
                    success: false,
                    message: "Password and Confirm Password do not match."
                });
            }

            // 4. Check if user already exists (email or rollNumber)
            const existingUser = await db.query(
                'SELECT * FROM users WHERE email = $1 OR roll_number = $2',
                [email, rollNumber]
            );

            if (existingUser.rows.length > 0) {
                return res.status(400).send({
                    success: false,
                    message: "User with this email or roll number already exists."
                });
            }

            // 5. Set default role for student
            const role = 'student'; // Assuming 'student' is a valid value in your user_role enum

            // 6. Insert new user into PostgreSQL database
            const result = await db.query(
                `INSERT INTO users (
                    full_name, email, roll_number, password, role, 
                    hostel_name, room_number, phone_number, department_name, 
                    passing_year, profile_picture, laundry_id
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
                RETURNING id, email, full_name, roll_number, role, hostel_name, room_number, phone_number, department_name, passing_year, laundry_id, created_at`,
                [
                    fullName, 
                    email, 
                    rollNumber, 
                    password, // Consider hashing this
                    role,
                    hostelName || null,        // Optional - defaults to null
                    roomNumber || null,        // Optional - defaults to null  
                    phoneNumber || null,       // Optional - defaults to null
                    departmentName || null,    // Optional - defaults to null
                    passingYear ? parseInt(passingYear) : null, // Optional - convert to integer
                    profilePicture || null,    // Optional - defaults to null
                    laundryId || null          // Optional - defaults to null
                ]
            );
            // Update the user to set laundry_id = id
        await db.query(
            'UPDATE users SET laundry_id = id::VARCHAR WHERE id = $1',
            [result.rows[0].id]
        );

        // Fetch the updated user
        const updatedUser = await db.query(
            'SELECT * FROM users WHERE id = $1',
            [result.rows[0].id]
        );
            console.log('Student registered successfully:', updatedUser.rows[0]);

            res.status(201).send({
                success: true,
                message: 'Student registered successfully!',
                data: result.rows[0] // Returns all non-sensitive data
            });

        } else {
            // If any required field is missing
            res.status(400).send({
                success: false,
                message: 'Please provide all required fields: fullName, email, rollNumber, password, confirmPassword.'
            });
        }
    } catch (err) {
        console.error('Registration error:', err);
        
        // Handle specific PostgreSQL errors
        if (err.code === '23505') { // Unique constraint violation
            return res.status(400).send({
                success: false,
                message: 'Email or roll number already exists.'
            });
        }

        res.status(500).send({
            success: false,
            message: 'An error occurred during registration.',
            error: err.message
        });
    }
};

// Assuming you have a Mongoose model named 'staffModal'
// import staffModal from '../models/staffModel.js'; // Example import

static staffRegister = async (req, res) => {
    try {
        // 1. Destructure the required fields for a staff member from the request body
        const { fullName, email, staffCode, password, confirmPassword } = req.body;

        // 2. Check if all fields have been provided
        if (fullName && email && staffCode && password && confirmPassword) {
            
            // 3. Validate that the password and confirmation password match
            if (password !== confirmPassword) {
                return res.status(400).send({
                    success: false,
                    message: "Password and Confirm Password do not match."
                });
            }

            // 4. Check if staff code exists in staff_codes table and is not used
            const validStaffCode = await db.query(
                'SELECT * FROM staff_codes WHERE staff_code = $1 AND is_used = false',
                [staffCode]
            );

            if (validStaffCode.rows.length === 0) {
                return res.status(400).send({
                    success: false,
                    message: "Invalid or already used staff code. Please contact administrator."
                });
            }

            // 5. Check if staff already exists (email or staff code)
            const existingStaff = await db.query(
                'SELECT * FROM staff WHERE email = $1 OR staff_code = $2',
                [email, staffCode]
            );

            if (existingStaff.rows.length > 0) {
                return res.status(400).send({
                    success: false,
                    message: "Staff with this email or staff code already exists."
                });
            }

            // 6. Insert new staff member into staff table
            const result = await db.query(
                `INSERT INTO staff (
                    staff_code, full_name, email, password, role
                ) VALUES ($1, $2, $3, $4, $5) 
                RETURNING id, staff_code, full_name, email, role, is_active, created_at`,
                [
                    staffCode,
                    fullName, 
                    email, 
                    password, // Consider hashing this
                    'staff' // Default role
                ]
            );

            // 7. Mark the staff code as used in staff_codes table
            await db.query(
                'UPDATE staff_codes SET is_used = true WHERE staff_code = $1',
                [staffCode]
            );

            console.log('Staff registered successfully:', result.rows[0]);

            res.status(201).send({
                success: false,
                message: 'Staff member registered successfully!',
                data: {
                    id: result.rows[0].id,
                    staffCode: result.rows[0].staff_code,
                    fullName: result.rows[0].full_name,
                    email: result.rows[0].email,
                    role: result.rows[0].role,
                    isActive: result.rows[0].is_active,
                    createdAt: result.rows[0].created_at
                }
            });

        } else {
            // If any of the required fields are missing
            res.status(400).send({
                success: false,
                message: 'Please provide all required fields: fullName, email, staffCode, password, confirmPassword.'
            });
        }
    } catch (err) {
        console.error('Staff registration error:', err);
        
        // Handle specific PostgreSQL errors
        if (err.code === '23505') { // Unique constraint violation
            return res.status(400).send({
                success: false,
                message: 'Email or staff code already exists.'
            });
        }

        res.status(500).send({
            success: false,
            message: 'An error occurred during staff registration.',
            error: err.message
        });
    }
};

// Make sure to import both of your Mongoose models and jwt
static loginUser = async (req, res) => {
    try {
        // 1. Get credentials from request body
        const { email, password } = req.body;
        console.log(email);

        // 2. Validate that both fields are provided
        if (!email || !password) {
            return res.status(400).send({
                success: false,
                message: 'Please provide both email and password.'
            });
        }

        let user = null;
        let userRole = '';
        let userTable = '';

        // 3. First, check in staff table
        const staffResult = await db.query(
            'SELECT * FROM staff WHERE email = $1',
            [email]
        );

        if (staffResult.rows.length > 0) {
            user = staffResult.rows[0];
            userRole = 'staff';
            userTable = 'staff';
        } else {
            // 4. If not found in staff table, check in users table (students)
            const userResult = await db.query(
                'SELECT * FROM users WHERE email = $1',
                [email]
            );
            // console.log(ucls
            // serResult);
            if (userResult.rows.length > 0) {
                user = userResult.rows[0];
                userRole = user.role; // 'student' or 'admin'
                userTable = 'users';
            }
        }
        // console.log(user)
        // console.log(userResult)
        // 5. Check if a user was found and if the password matches
        if (user && password === user.password) {
            // Password matches (plain text comparison)

            // 6. Generate a single JWT Access Token
            const accessToken = jwt.sign(
                { 
                    name: user.full_name, 
                    role: userRole, 
                    id: user.id,
                    email: user.email,
                    table: userTable // Include which table the user belongs to
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '1d' } // Token will be valid for 1 day
            );

            // 7. Set the access token in a cookie and send the response
            res.cookie('jwtAccess', accessToken, { 
                httpOnly: true, 
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'Strict', 
                maxAge: 24 * 60 * 60 * 1000 
            });

            // 8. Prepare user data for response (exclude password)
            const userData = {
                id: user.id,
                name: user.full_name,
                email: user.email,
                role: userRole,
                isVerified: user.is_verified || true, // Staff are verified by default
                createdAt: user.created_at
            };

            // 9. Add role-specific fields
            if (userRole === 'student') {
                userData.rollNumber = user.roll_number;
                userData.hostelName = user.hostel_name;
                userData.roomNumber = user.room_number;
                userData.departmentName = user.department_name;
                userData.passingYear = user.passing_year;
                userData.laundryId = user.laundry_id;
                userData.isVerified = user.is_verified || false;
            } else if (userRole === 'staff') {
                userData.staffCode = user.staff_code;
                userData.isActive = user.is_active;
                // Staff-specific fields from staff table
            } else if (userRole === 'admin') {
                userData.isAdmin = true;
                // Admin-specific fields
            }

            res.status(200).send({
                success: true,
                message: `Login Successful - Welcome ${userRole}`,
                user: userData,
                accessToken
            });

        } else {
            // User not found OR password did not match
            res.status(401).send({
                success: false,
                message: 'Invalid email or password.'
            });
        }
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).send({
            success: false,
            message: 'An error occurred during login.',
            error: error.message
        });
    }
};
}

export default userController