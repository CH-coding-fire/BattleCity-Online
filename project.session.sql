CREATE TABLE users(
    id SERIAL primary key,
    name varchar(255),
    password varchar(255),
    win integer,
    create_time timestamp
);
INSERT INTO users (name, password)
values ('111', '111');
INSERT INTO users (name, password)
values ('222', '222');
ALTER TABLE users
ALTER COLUMN create_time TYPE timestamp;
SELECT *
from users
where name = 'hkbb';
DELETE from users
where name like '%q%';