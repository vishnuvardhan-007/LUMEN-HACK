CREATE TABLE user_data (
    user_id INT PRIMARY KEY,
    name VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(150),
    status VARCHAR(20)
);

-- Plans
CREATE TABLE subscription_plans (
    product_id INT PRIMARY KEY,
    name VARCHAR(100),
    price NUMERIC(10,2),
    auto_renewal_allowed VARCHAR(10),
    status VARCHAR(20)
);

-- Subscriptions
CREATE TABLE subscriptions (
    subscription_id INT PRIMARY KEY,
    subscription_type VARCHAR(50),
    product_id INT REFERENCES subscription_plans(product_id),
    user_id INT REFERENCES user_data(user_id),
    status VARCHAR(20),
    start_date DATE,
    last_billed_date DATE,
    last_renewed_date DATE,
    grace_time INT
);

-- Logs
CREATE TABLE subscription_logs (
    subscription_id INT REFERENCES subscriptions(subscription_id),
    current_status VARCHAR(50),
    next_status VARCHAR(50),
    action VARCHAR(50),
    action_date DATE
);


-- Billing
CREATE TABLE billing_information (
    billing_id INT PRIMARY KEY,
    subscription_id INT REFERENCES subscriptions(subscription_id),
    amount NUMERIC(10,2),
    billing_date DATE,
    payment_status VARCHAR(20)
);

ALTER TABLE subscription_logs
DROP CONSTRAINT subscription_logs_subscription_id_fkey;

