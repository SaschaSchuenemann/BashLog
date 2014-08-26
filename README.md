BashLog
=======
Small nodejs app for improved bash logging.
Currently in development stage. Use at own Risk!

The idea of the App is to make selecting and processing bash commands easier. 
After selecting the wanted commands, one click at export creates two files, one textfile containing all the selected commands, another one containing html code that can be directly copy'n'pasted into a blog.

##Howto use
Download the repo and create the folders `commands` and and `history` in the main directory (from here on called $BASHLOG_DIR).


Run the app from the main directory

`node app.js`

If you want to monitor a single shell run

`PROMPT_COMMAND="history >> /tmp/history; $BASHLOG_DIR/lib/lastCmd.sh"`

Now every command you enter ( in the same shell ) gets copied to the commands dir within $BASHLOG_DIR and will eventually get picked up by the node instance and hence displayed on the App.

If one wants to select from a whole history file, just pipe it into the history directory

`history > $BASHLOG_DIR/history/file`
