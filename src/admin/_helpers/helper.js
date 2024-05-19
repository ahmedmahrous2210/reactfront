function formatDateTime (d) {
  var date = new Date(d)
  var hours = date.getHours()
  var minutes = date.getMinutes()
  var ampm = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12
  hours = hours ? hours : 12 // the hour '0' should be '12'
  hours = hours < 10 ? '0' + hours : hours
  minutes = minutes < 10 ? '0' + minutes : minutes
  var strTime = hours + ':' + minutes + ' ' + ampm
  var month =
    date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
  var dt = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
  var yr = date.getFullYear()
  return month + '-' + dt + '-' + yr + ' ' + strTime
}

function formatDate (d) {
  var date = new Date(d)
  var month =
    date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
  var dt = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
  var yr = date.getFullYear()
  return month + '-' + dt + '-' + yr
}

function formatTime (time) {
  console.log("time format", time);
  var times = time.split(':')
  var hours = times[0]
  var minutes = times[1]
  var ampm = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12
  hours = hours ? hours : 12 // the hour '0' should be '12'\
  return hours + ':' + minutes + ' ' + ampm
}

module.exports = {
  formatDateTime: formatDateTime,
  formatDate: formatDate,
  formatTime: formatTime
}
