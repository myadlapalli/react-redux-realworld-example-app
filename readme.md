#myadlapalli
1. Python, Pip, AWS CLI should be installed.
2. We have to start the Lab now
3. Here we have to configure the AWS credentials locally.
> declare this command will help to configure aws credeetntials locally on the system
4. check for credentials and config files
> cd .aws\
> open credentials\
> open config
5. Paste the cloud credentials access in the cedentials file AWS details >> cloud access >> AWS CLI.
6. Testing of the credentials should be done to know whether it is running by using the following command
> aws ec2 describe-instances
7. Key pair should be created to Ec2 instance in python
8. Run the code and then create an Ec2 instance
9. Now go to EC2 instances and wait for the instance state until running and status check is done.
10. In the instance details, find the IPv4 and paste it in a new border window

In MS visual studio terminal I have run the command python <filename>.py 


import boto3

def start_instance():
    ec2 = boto3.client("ec2")
    ec2.run_instances(
        ImageId = 'ami-087c17d1fe0178315',
        MinCount = 1,
        MaxCount =1,
        InstanceType = 't2.micro',
        TagSpecifications = 
        [
          {
            'ResourceType': 'instance',
            'Tags': 
             [
                 {
                    'Key': 'Name',
                    'Value': 'Web Server'
                 },
             ]
          },
        ],
        UserData="#!/bin/bash \n yum update -y \n yum -y install httpd \n systemctl enable httpd \n systemctl start httpd \n echo '<html><h1>Hello World!</h1></html>' > /var/www/html/index.html"

    )

    response = ec2.describe_vpcs()
    vpc_id = response.get('Vpcs', [{}])[0].get('VpcId', '')

    response = ec2.create_security_group(GroupName = 'Web Server', Description = 'Security group for my web server',VpcId=vpc_id)
    security_group_id = response['GroupId']
    data = ec2.authorize_security_group_ingress(
        GroupId = security_group_id,
        IpPermissions = [
            {'IpProtocol':'TCP','FromPort':80, 'ToPort':80, A'IpRanges':[{'CidrIp':'0.0.0.0/0'}]}
             ]
    )
 
