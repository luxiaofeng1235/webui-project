#!/bin/bash
echo "=== USERS TABLE ==="
mysql -h 172.20.0.1 -u wsl_user -p123456 -P3306 -D restaurant -e "DESCRIBE users;"

echo -e "\n=== MENU_CATEGORIES TABLE ==="
mysql -h 172.20.0.1 -u wsl_user -p123456 -P3306 -D restaurant -e "DESCRIBE menu_categories;" 2>/dev/null || echo "Table does not exist"

echo -e "\n=== MENU_ITEMS TABLE ==="
mysql -h 172.20.0.1 -u wsl_user -p123456 -P3306 -D restaurant -e "DESCRIBE menu_items;" 2>/dev/null || echo "Table does not exist"

echo -e "\n=== TABLES TABLE ==="
mysql -h 172.20.0.1 -u wsl_user -p123456 -P3306 -D restaurant -e "DESCRIBE tables;" 2>/dev/null || echo "Table does not exist"

echo -e "\n=== ORDERS TABLE ==="
mysql -h 172.20.0.1 -u wsl_user -p123456 -P3306 -D restaurant -e "DESCRIBE orders;" 2>/dev/null || echo "Table does not exist"

echo -e "\n=== ORDER_ITEMS TABLE ==="
mysql -h 172.20.0.1 -u wsl_user -p123456 -P3306 -D restaurant -e "DESCRIBE order_items;" 2>/dev/null || echo "Table does not exist"

echo -e "\n=== SETTINGS TABLE ==="
mysql -h 172.20.0.1 -u wsl_user -p123456 -P3306 -D restaurant -e "DESCRIBE settings;" 2>/dev/null || echo "Table does not exist"

echo -e "\n=== ALL TABLES ==="
mysql -h 172.20.0.1 -u wsl_user -p123456 -P3306 -D restaurant -e "SHOW TABLES;"