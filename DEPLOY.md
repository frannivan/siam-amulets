# Deploying AmuletsOfSiam to Oracle Cloud Free Tier

## Prerequisites
1.  **Oracle Cloud Account**: Active account with access to Compute instances.
2.  **Instance**: VM.Standard.A1.Flex (ARM) or VM.Standard.E2.1.Micro (x86). Ubuntu or Oracle Linux.
3.  **SSH Key**: Access to the instance.

## 1. Prepare the Server
Connect to your instance via SSH:
```bash
ssh -i /path/to/key ubuntu@<public-ip>
```

Update system and install Docker & Git:
```bash
# For Ubuntu
sudo apt update && sudo apt upgrade -y
sudo apt install docker.io docker-compose -y
sudo usermod -aG docker $USER
newgrp docker

# Verify
docker --version
```

## 2. Deploy the Application
Clone the repository:
```bash
git clone https://github.com/frannivan/siam-amulets.git
cd siam-amulets
```

Run with Docker Compose:
```bash
# Start in background
docker-compose up -d --build
```

## 3. Configure Networking
Oracle Cloud requires opening ports in the Security List AND the instance firewall.

1.  **OCI Console**:
    -   Go to **Networking > Virtual Cloud Networks**.
    -   Select your VCN and then the **Subnet**.
    -   Click **Security List** > **Add Ingress Rule**.
    -   Source CIDR: `0.0.0.0/0`, Protocol: TCP, Destination Port: `8081`.

2.  **Instance Firewall (Ubuntu/IPtables)**:
    ```bash
    sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 8081 -j ACCEPT
    sudo netfilter-persistent save
    ```

## 4. Verify
Visit `http://<your-public-ip>:8081` in your browser.
