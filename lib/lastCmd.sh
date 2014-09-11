#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
asSingleFile=false
commandsDir="$DIR/../commands"
#commandFile="commandsFile"
commandFile=`date +%d-%m-%y-%H%M%S`
sndLastCmdFile=$DIR/secondLastCmd

lastCommand="`tail -n 1 ~/.bash_history`"




if [[ ! -d $lastCommand ]] && [[ ! $lastCommand == "`cat $sndLastCmdFile`" ]]; then
 echo $lastCommand > "$commandsDir/$commandFile"
 echo $lastCommand > $sndLastCmdFile
fi

