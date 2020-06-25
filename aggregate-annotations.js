#!/usr/bin/env node

const { db } = require('../database/google-cloud')

db.collection('pois')

async function aggregate () {
  const query = db.collection('pois')

  const poiRefs = await query.get()

  if (poiRefs.empty) {
    console.error('No POIs found')
  } else {
    const aggregatedAnnotations = {}

    for (const poiRef of poiRefs.docs) {
      const poi = poiRef.data()
      const annotations = poi.annotations || {}

      for (let [annotationType, count] of Object.entries(annotations)) {
        const typeAggregatedAnnotations = aggregatedAnnotations[annotationType] || {}

        aggregatedAnnotations[annotationType] = {
          ...typeAggregatedAnnotations,
          [count]: (typeAggregatedAnnotations[count] || 0) + 1
        }
      }
    }

    await db.collection('aggregates').doc('annotations').update(aggregatedAnnotations)
  }
}

aggregate()
