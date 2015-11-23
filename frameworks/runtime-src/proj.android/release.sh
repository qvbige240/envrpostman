#!/bin/bash
VERSION_NUM=1.0.1
source /etc/profile #Source file PATH, sometimes no NDK_ROOT defined.
LOG_FILE=`pwd`/log.txt
function mk_antbuild()
{
    ant clean > $LOG_FILE
    ant auto-release -Dversion=time >> $LOG_FILE
}
#mk_nativebuild $1
mk_antbuild
cp `pwd`/bin/com*apk `pwd`/../../../publish/android/
