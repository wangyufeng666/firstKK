#! /bin/bash
zipinfo -1 hkfs.zip | grep [.] > list.txt
filename=`date +%Y_%m_%d_%H_%M_%S`bak
tar -cvf bak/$filename.tar -T list.txt
unzip -o hkfs.zip
rm -f list.txt
rm -f hkfs.zip
