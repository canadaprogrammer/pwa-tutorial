// REAL-TIME LISTENER
db.collection('recipes').onSanpshot(snapshot => {
  console.log(snapshot.docChanges())
})