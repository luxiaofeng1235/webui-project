#!/bin/bash
mysql -h 172.20.0.1 -u wsl_user -p123456 -P3306 -D restaurant -e "DESCRIBE users;"