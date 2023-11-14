
USE freedb_Dreams;


CREATE TABLE Users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL
);


CREATE TABLE Dreams (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    description TEXT NOT NULL,
    emotional_color VARCHAR(20),
    categories TEXT,
    FOREIGN KEY (user_id) REFERENCES Users(id)
);
INSERT INTO Users (username, password, email)
VALUES
    ('john_doe', 'johndoe123', 'john.doe@example.com'),
    ('alice_smith', 'alicesmith456', 'alice.smith@example.com'),
    ('bob_jones', 'bobjones789', 'bob.jones@example.com');
    
SET @user1_id = (SELECT id FROM Users WHERE username = 'john_doe');
SET @user2_id = (SELECT id FROM Users WHERE username = 'alice_smith');
SET @user3_id = (SELECT id FROM Users WHERE username = 'bob_jones');
INSERT INTO Dreams (user_id, description, emotional_color, categories)
VALUES
    (@user1_id, 'Flying in the clouds', 'Blue', 'Adventure,Fantasy'),
    (@user2_id, 'Meeting friendly aliens', 'Green', 'Sci-Fi'),
    (@user1_id, 'Exciting rollercoaster ride', 'Red', 'Adventure,Exciting');
    
    



