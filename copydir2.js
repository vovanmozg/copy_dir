//----------------------------------------------------------------
// Copy directory using Windows Script Host
// modified: 24/09/2003
// xcode copyright by Dmitry Khmelyov http://www.rusf.ru/books/yo/xcode.html
//----------------------------------------------------------------

var LogFile = "autowin.log";	// logfile path
var fso;
var commands = "";

//----------------------------------------------------------------
function CreateFolder(dirname) {
  //LogMessaga("1. Need create dir "+dirname);
  re = new RegExp("[*?\"<>|]", "");
  if (dirname == "" || dirname == "." || dirname == ".." || dirname.match(re)) return;
  var fso = new ActiveXObject("Scripting.FileSystemObject");
  if (!fso.FolderExists(dirname)) {
    //LogMessaga("2. no exists "+dirname);
    var i = dirname.length;
    do {
      i--;
    } while (dirname.substr(i, 1) != "\\");
    CreateFolder(dirname.substr(0, i));
    fso.CreateFolder(dirname);
    //LogMessaga("3. directory created "+dirname);
  }
  //else{ LogMessaga("4. directory "+dirname+" exists") };
}
//----------------------------------------------------------------
function CopyDir(source, dest) {
  var fc, s;
  if (fso.FolderExists(source)) {
    Fsource = fso.GetFolder(source);			// get directory descriptor

    files = new Enumerator(Fsource.Files);
    for (; !files.atEnd(); files.moveNext()) {
      var file = files.item();		// get next file
      commands += ("copy \"" + source + "\\" + file.Name + "\" \"" + dest + "\\" + file.Name + "\"\r\n");
    }

    CreateFolder(dest);											// create dir
    // get directories list
    var folders = new Enumerator(Fsource.SubFolders);
    // each directory
    for (; !folders.atEnd(); folders.moveNext()) {
      var folder = folders.item();					// get next subdirectory
      CopyDir(source + "\\" + folder.Name, dest + "\\" + folder.Name);
    }
  }
}

//----------------------------------------------------------------

// command line arguments
var objArgs = WScript.Arguments;
if (objArgs.length < 2) {
  WScript.echo("arguments required");
  WScript.Quit();
}

var WshShell = WScript.CreateObject("WScript.Shell");
fso = new ActiveXObject("Scripting.FileSystemObject");

CopyDir(objArgs.Item(0), objArgs.Item(1));

// create bat-פאיכ
var fs = new ActiveXObject("Scripting.FileSystemObject");
var a = fs.CreateTextFile("kokonuto.bat", true);
a.Write(commands);
a.WriteLine("pause");
a.Close();

// convert file to DOS encoding
rez = WshShell.Run("xcode -a kokonuto.bat kokonuto.bat", 1, true);
//LogMessaga("["+rez+"] executing xcode");
// run bat-file
rez = WshShell.Run("kokonuto.bat", 1, true);
//LogMessaga("["+rez+"] copy success");


//CreateFolder( "c:\\temp\\kokonutti\\1\\2\\3" );

//----------------------------------------------------------------
function LogMessaga(Messaga, mode) {
  var fso = new ActiveXObject("Scripting.FileSystemObject");
  // open log-file for adding
  var MyFile = fso.OpenTextFile(LogFile, (mode) ? (mode) : (8), 1);
  //MyFile.WriteLine("["+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds()+"] "+ Messaga);			// write
  // write message
  MyFile.WriteLine(Messaga);
  MyFile.Close() // close file
}