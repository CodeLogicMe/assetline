window.fuzzySearch = {
  findPatterns: function(pattern, name) {
    var matches = [];

    name.forEach(function(string, index) {
      var stringIndex   = 0,
          lastSearch     = 0,
          query         = pattern.replace(/\s+/g, '').split(''),
          queryIndex    = 0,
          matchPos      = [],
          nameObj       = fuzzySearch.makeNameObj(string),
          priorityMatch = true,
          giveUp        = false;

      while(query.length > 0) {
        if(priorityMatch) {
          //find uppercase matches (later, look for possible section starters)
          lastSearch = lookUpper(stringIndex, nameObj, query[queryIndex]);

          if(lastSearch === -1) {
            lastSearch = lookAny(stringIndex + 1, nameObj, query[queryIndex]);
            if(lastSearch === -1) {
              priorityMatch = false;
              query         = pattern.replace(/\s+/g, '').split('');
              matchPos.length = 0;
              stringIndex = 0;
            }
            else {
              stringIndex = lastSearch;
              matchPos.push(stringIndex);
              query.splice(queryIndex,1);
            }

          }
          else {
            stringIndex = lastSearch;
            matchPos.push(stringIndex);
            query.splice(queryIndex,1);
          }
        }

        else {
          lastSearch = lookAny(stringIndex + 1, nameObj, query[queryIndex]);
          if(lastSearch === -1) {
            giveUp = true;
            break;
          }
          else {
            stringIndex = lastSearch;
            matchPos.push(stringIndex);
            query.splice(queryIndex,1);
          }
        }
      }

      var matchedObj = {
        name: string,
        pos: index,
        nameObj: nameObj,
        matchPos: matchPos,
        totalWeight: 0
      }

      if(giveUp === false)
        matches.push(matchedObj);
    });

    function lookUpper(index, nameObject, queryItem) {
      while(index < nameObject.length) {
        if(nameObject[index].c.toLowerCase() === queryItem.toLowerCase() && nameObject[index].beginSection) {
          return index;
        }
        index++;
      }
      return -1;
    }

    function lookAny(index, nameObject, queryItem) {
      while(index < nameObject.length) {
        if(nameObject[index].c.toLowerCase() === queryItem.toLowerCase()) {
          return index;
        }
        index++;
      }
      return -1;
    }

    return fuzzySearch.calculateRank(matches).sort(fuzzySearch.compareRank);
  },

  calculateRank: function(matches) {

    matches.forEach(function(match) {
      var substringSize = 0;
      match.matchPos.forEach(function(elem, index) {
        if(match.nameObj[elem].beginSection === true) {
          match.nameObj[elem].weight = (80 - elem);
          match.totalWeight += match.nameObj[elem].weight;

          if(match.matchPos[index - 1] == elem - 1) {
            substringSize++;
            match.nameObj[elem].weight += 15 * Math.pow(2, substringSize) - elem;
            match.totalWeight += match.nameObj[elem].weight;
          }
        }
        else if(match.matchPos[index - 1] == elem - 1) {
          substringSize++;
          match.nameObj[elem].weight = 15 * Math.pow(2, substringSize) - elem;
          match.totalWeight += match.nameObj[elem].weight;
        }
        else {
          match.nameObj[elem].weight = 10 - elem;
          match.totalWeight += match.nameObj[elem].weight;
        }

        match.totalWeight -= ((match.name.length - 1) - match.matchPos[match.matchPos.length - 1]);
      });
    });

    return matches;
  },

  compareRank: function(a, b) {
    if (a.totalWeight > b.totalWeight)
      return -1;
    if (a.totalWeight < b.totalWeight)
      return 1;
    return 0;
  },

  isUpper: function(ch) {
    return ch.toUpperCase() === ch;
  },

  makeNameObj: function(name) {
    var nameObj = [];

    for(var i = 0; i < name.length; i++) {
      var n = {
                c: name[i],
                beginSection: i === 0 || (fuzzySearch.isUpper(name[i]) && !fuzzySearch.isUpper(name[i - 1])) ? true : false,
                weight: 0
              }
      nameObj.push(n);
    }
    return nameObj;
  },
}