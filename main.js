//====================================================

//==== Browser detection ========
var supportsInnerText = true;  // May be set to false in init()

//==== Globals ==============

var intNames = new Array("1","b9","9","b3","3","4","b5","5","#5","6","b7","7")
var noteNames = new Array("C","Db","D","Eb","E","F","Gb","G","Ab","A","Bb","B")

var guitarTunings = new Array(4, 9, 2, 7, 11, 4);
var fiddleTunings = new Array(7, 2, 9, 4);
var ukuleleTunings = new Array(7, 0, 4, 9);
var bassTunings    = new Array(4, 9, 2, 7);
var dobroTunings = new Array(7, 11, 2, 7, 11, 2);

var tunings = guitarTunings   // default can be changed to fiddle

var numStrings = -99  // set in init

var kbLength = 13

var keys = new Array(-1, -1) //  Maybe one day have more than 2 fretboards.  Init to junk to start.

var fbStrings0 = new Array()
var fbStrings1 = new Array()
var fbStringSets = new Array(fbStrings0, fbStrings1)

var activeTones0 = new Array()
var activeTones1 = new Array()
var activeToneSets = new Array(activeTones0, activeTones1)

var linkFBs = true
var showInterval = true
var showNoteNames = false

var dumptext = "\n"

//====================================================
function init() {
  if (document.getElementById("dumpArea").innerText == undefined) {
    supportsInnerText = false;
  }

  numStrings = tunings.length

  allocStrings(0)
  allocStrings(1)

  initFretboard(0)
  initFretboard(1)

  pickKey(0, 0)
  pickKey(1, 5)
}

//===================================================
// Differs per browser
function innerStuff(elem, stuff)
{
  if (supportsInnerText) {
    elem.innerText = stuff;
  }
  else {
    elem.textContent = stuff;
  }
}

//====================================================
function clickInstruType()
{
  if (document.getElementById('guitarRadio').checked)
  {
    tunings = guitarTunings
  }
  else if (document.getElementById('fiddleRadio').checked)
  {
    tunings = fiddleTunings
  }
  else if (document.getElementById('ukuleleRadio').checked)
  {
    tunings = ukuleleTunings
  }
  else if (document.getElementById('bassRadio').checked)
  {
    tunings = bassTunings
  }
  else if (document.getElementById('dobroRadio').checked)
  {
    tunings = dobroTunings
  }
  else
  {
    alert ("Something is terribly wrong.  George Bush isn't still president, is he?")
  }

  init()
  clearNotes(0)
  clearNotes(1)
}

//====================================================
function clickLinkFBs(checkbox)
{
    if (checkbox.checked) {
      linkFBs = true
    }
    else {
      linkFBs = false
    }

    setStringInts(0)
    setStringInts(1)
}

//====================================================
function clickShowNotes(checkbox)
{
    if (checkbox.checked) {
      showNoteNames = true
    }
    else {
      showNoteNames = false
    }
    setStringInts(0)
    setStringInts(1)
}

function clickShowInterval(checkbox)
{
    if (checkbox.checked) {
      showInterval = true
    }
    else {
      showInterval = false
    }
    setStringInts(0)
    setStringInts(1)
}


//===============
function clearNotes(fbNum)
{
  activeToneSets[fbNum].length = 0
  setStringInts(0)
  setStringInts(1)
}

//===============
function debug()
{
    var dumparea=document.getElementById('dumpArea')
    innerStuff(dumpArea, dumptext);
}

//====================================================
function allocStrings(fbNum)
{
 var fbStrings = fbStringSets[fbNum]
 for (i=0; i<numStrings; i++)
 {
    var aString = new Array()
    fbStrings[i] = aString
    for (j=0; j<kbLength; j++)
    {
      var spot = new Object()
      ptr = getIdxForStringOffset(j, i)
      spot.noteName = noteNames[ptr]    // Set the note names, which don't change.
      spot.absoluteTone = ptr           // C=0 ... B=11

      if (j == 0)  {
        spot.fretType = "nut"
      }
      else if (j==3 || j==5 || j==7 || j==9 || j==12)   {
        spot.fretType = "marker"
      }
      else {
        spot.fretType = "plain"
      }

      aString[j]=spot
//      dumptext += spot.absoluteTone + "."
    }
    fbStrings[i] = aString
  } 
}


//====================================================
function initFretboard(fbNum)
{
  var fbStrings = fbStringSets[fbNum]

  var fb=document.getElementById('fretboard' + fbNum)
  innerStuff(fb, "");

  for (i=0; i<numStrings; i++)
  {
    row = fb.insertRow(0)
    for (j=0; j<kbLength; j++)
    {
      var td=row.insertCell(j)

      var funcStr = "spotClicked(" + fbNum + "," + i + "," + j + ")"
      td.onclick=Function(funcStr)

      var spot=fbStrings[i][j]

      spot.td = td
    }
  }
}

//====================================================
function getIdxForStringOffset(loopIdx, stringNum)
{
  var openOffset = tunings[stringNum]
  var arrayIdx = openOffset + loopIdx
  if (arrayIdx > 11)
  {
      arrayIdx = arrayIdx - 12
  }
  return arrayIdx
}

//====================================================
function pickKey(fbNum, chosenKey)
{
  if (chosenKey == keys[fbNum])
  {
    return
  }

  keys[fbNum] = chosenKey

  var keyTd
  var tdId
  for (i=0; i<12; i++)
  {
    tdId = "k_" + fbNum + "_" + i
    keyTd = document.getElementById(tdId)
    if (i == chosenKey)
    {
      keyTd.className="pickKey1";
    }
    else
    {
      keyTd.className="pickKey0";
    }
  }
 var fb=document.getElementById('fretboard' + fbNum)
 setStringInts(fbNum)
}

//===================================================
function setStringInts(fbNum)
{
 var fbStrings = fbStringSets[fbNum]

 var key = keys[fbNum]

 var activeToneSet
 if (linkFBs) {
   activeToneSet = activeToneSets[0]
 }
 else {
   activeToneSet = activeToneSets[fbNum]
 }

 for (i=0; i<numStrings; i++)
 {
   for (j=0; j<kbLength; j++)
   {
      var spot = fbStrings[i][j]
      var idx = spot.absoluteTone - key
      if (idx < 0)
      {
        idx = idx + 12
      }
      spot.intName = intNames[idx]
      var spot = fbStrings[i][j]

      // All spots get the .fret class
      var spotClass = "fret "
      // Active spots also get .fretOn class
      if (isToneActive(activeToneSet, spot.absoluteTone) )    {
         spotClass += "fretOn"
      } // Inactive spots also get .plainOff, .nutOff or .markerOff
      else  {
         spotClass += spot.fretType + "Off"
      }

      spot.td.className=spotClass
   }
 }
 tdLabels(fbStrings)
}

//===================================================
function isToneActive(activeTonesArray, tone)
{
  for (x=0; x<activeTonesArray.length; x++)
  {
//    dumptext += x + " is " + tone + "equal to " + activeTonesArray[x] + "\n"
    if (tone == activeTonesArray[x])
    {
      return true
    }
  }
  return false
}

//===================================================
function tdLabels(fbStrings, row, col)
{
  for (i=0; i<numStrings; i++)
  {
    for (j=0; j<kbLength; j++)
    {
      if (showNoteNames && showInterval)   {
        innerStuff(fbStrings[i][j].td, fbStrings[i][j].noteName + "/" + fbStrings[i][j].intName);
      }  else if (showInterval) {
        innerStuff(fbStrings[i][j].td, fbStrings[i][j].intName);
      } else if (showNoteNames)   {
        innerStuff(fbStrings[i][j].td, fbStrings[i][j].noteName);
      } else {
        innerStuff(fbStrings[i][j].td, "");
      }
    }
  }
}

//====================================================
function spotClicked(fbNum, row, col)
{
  // Get the tone that was hit.
  var spot = fbStringSets[fbNum][row][col]
  var tone = spot.absoluteTone

  var activeToneSetPtr
  if (linkFBs) {
    activeToneSetPtr = 0
  }
  else {
    activeToneSetPtr = fbNum
  }
  var activeToneSet = activeToneSets[activeToneSetPtr]

  // Loop through active tones, building a new replacement array.
  // If the tone is in the orig, the we are turning it off, don't add to new.
  // If it was never found in the orig, add it to the newArray
  var newArray = new Array()
  var removeTone = false
  for (x=0; x<activeToneSet.length; x++)
  {
    if (tone == activeToneSet[x]) {
      removeTone = true
    }
    else {
      newArray.push(activeToneSet[x])
    }
  }
  if (removeTone == false) {
      newArray.push(tone)
  }
  activeToneSets[activeToneSetPtr] = newArray

  setStringInts(0)
  setStringInts(1)
}

