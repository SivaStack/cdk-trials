import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

export class MyEc2InstanceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
      super(scope, id, {
          ...props,
          env: {
              account: '905418133053',
              region: 'ca-central-1'
          }
      });

    // Create a VPC
    const vpc = new ec2.Vpc(this, 'MyVpc', {
      maxAzs: 2, // Limit to 2 Availability Zones
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'PublicSubnet',
          subnetType: ec2.SubnetType.PUBLIC,
        },
      ],
    });

    // Create a security group
    const securityGroup = new ec2.SecurityGroup(this, 'MySecurityGroup', {
      vpc,
      securityGroupName: 'MySecurityGroup',
      description: 'Allow SSH access from anywhere',
    });

    // Add an ingress rule to allow SSH traffic from anywhere
    securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22), 'Allow SSH access from anywhere');

    // Create an EC2 instance
    const instance = new ec2.Instance(this, 'MyInstance', {
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO),
      machineImage: ec2.MachineImage.latestAmazonLinux2(), // Use the latest Amazon Linux AMI
      vpc,
      securityGroup,
      keyPair: ec2.KeyPair.fromKeyPairName(this, 'MyKeyPair', 'cdkKeyPair'), // Replace with the name of your key pair
    });

    // Tag the instance
    cdk.Tags.of(instance).add('Name', 'MyInstance');
  }
}
