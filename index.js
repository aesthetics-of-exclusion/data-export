const { db, deleteAnnotations, addAnnotation, setNextAnnotations } = require('../database/google-cloud')

async function getAnnotations (poiRef) {
  const annotationRefs = poiRef.collection('annotations')
  const annotations = await annotationRefs.get()

  // toDate
  return annotations.docs.map((annotation) => {
    const data = annotation.data()
    return {
      ...data,
      dateUpdated: data.dateUpdated.toDate(),
      dateCreated: data.dateCreated.toDate()
    }
  })
}

async function exportData () {
  const query = db.collectionGroup('annotations')
    .where('type', '==', 'check')
    .where('data.valid', '==', true)

  const annotationRefs = await query.get()

  if (annotationRefs.empty) {
    console.error('No POIs found')
  } else {
    for (const annotationRef of annotationRefs.docs) {
      const poiId = annotationRef.ref.parent.parent.id

      const poiRef = db.collection('pois').doc(poiId)
      const poi = await poiRef.get()
      const allAnnotations = await getAnnotations(poiRef)

      const data = {
        ...poi.data(),
        annotations: allAnnotations
      }

      console.log(JSON.stringify(data))

      // console.log(allAnnotations)

      // const data = annotation.data()
      // data.poiId

      // console.log(check.data())
    }
  }

  //   .then(async (snapshot) => {
//     if (snapshot.empty) {
//       console.log('No missing addresses')
//       return
//     }

//     for (const poi of snapshot.docs) {

}

exportData()

// db.collection('pois')
//   .where('annotations.check', '==', 0)
//   .get()
//   .then(async (snapshot) => {
//     if (snapshot.empty) {
//       console.log('No missing addresses')
//       return
//     }

//     for (const poi of snapshot.docs) {

// pak alle POIs met bepaalde annotatie

// grijp die POI en alle annotatie

// schrijf het!