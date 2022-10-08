# Patterns
A repository of patterns for the Fibonacci512 with Pixelblaze:


[https://www.evilgeniuslabs.org/fibonacci512-pixelblaze](https://www.evilgeniuslabs.org/fibonacci512-pixelblaze)


# Structure

I figure we should have a top level folder for each model/variant with the map and a README. Under that, we can have a few directories for: epe files, backup + instructions, and sources (especially for quick collaboration + PR review).

# Hacking tips

### Finding the ID for a pattern

The list of patterns is stored in a global called `programList`. This is visible in the browser dev console and can be used to find an ID for a name.

### Merge backup archives

The backup files are JSON, and it's possible to manually merge them or combine them to e.g. add patterns, just have to know the ID of the pattern.

### Restoring a single file

Here's a quick hack to restore a single file from a backup without deleting/overwriting everything.

This will come in handy to load a new pattern with preview + controls file without nuking everything on your LL.

In the browser dev console, paste this function:

```
function restoreSingleFile(name) {
  if (!(restoreState && restoreState.backupData && restoreState.backupData.files)) {
    console.log("Open a backup file first!");
    return;
  }
  var b64 = restoreState.backupData.files[name];
  if (!b64) {
    console.log("File " + name + " not found in backup data")
  }
  var data = dataURLtoBlob('data:application/octet-stream;base64,' + b64);
  var formData = new FormData();
  formData.append("data", data, name);
  return fetch("edit", {method: 'POST', body: formData}).then(function (response) {
    if (response.status == 200)
      console.log("File " + name + " has been restored");
    else
      console.log("Got error trying to upload file '" + name + "'. Response: " + response);
  })
}
```

Then on the settings tab, open the restore modal by clicking "Restore from Backup" but NOT ever "Start Restore" inside the modal. Click "Open backup file" ONLY, and pick your backup archive you want to restore from. 

Switch back to the console and call `restoreSingleFile` with the full file path. e.g.:
```
restoreSingleFile("/p/HKh65t879zmktQELH")
```

If your pattern has controls, restore the .c file too:

```
restoreSingleFile("/p/HKh65t879zmktQELH.c")
```
