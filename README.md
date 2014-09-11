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

`PROMPT_COMMAND="history -a; $BASHLOG_DIR/lib/lastCmd.sh"`

Now every command you enter ( in the same shell ) gets copied to the commands dir within $BASHLOG_DIR and will eventually get picked up by the node instance and hence displayed on the App. Currently, the bash-script only displays the unique commands. 

If entering the above prompt command in a second shell, you will get also the commands entered there. By exporting it in the bash_rc file, you can automatically active the logging. Just make sure that the node.js app is running. In the future there might be a small daemon script to automate the loading of the webApp.

If one wants to select from a whole history file, just pipe it into the history directory

`history > $BASHLOG_DIR/history/file`
