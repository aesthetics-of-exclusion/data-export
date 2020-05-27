#!/usr/bin/env node

const { db } = require('../database/google-cloud')

async function getAnnotations (poiRef) {
  const annotationRefs = poiRef.collection('annotations')
  const annotations = await annotationRefs.get()

  return annotations.docs.map((annotation) => {
    const data = annotation.data()
    return {
      id: annotation.id,
      ...data,
      dateUpdated: data.dateUpdated.toDate(),
      dateCreated: data.dateCreated.toDate()
    }
  })
}

async function exportData () {
  const query = db.collectionGroup('annotations')
    .where('type', '==', 'mask')
    // .where('data.valid', '==', true)

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
        id: poiId,
        ...poi.data(),
        annotations: allAnnotations
      }

      console.log(JSON.stringify(data))
    }
  }
}

exportData()
