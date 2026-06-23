const SAFETY_GRADE_CLASSES = {
  A: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  B: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  C: 'bg-orange-100 text-orange-800 border-orange-200',
  D: 'bg-red-100 text-red-800 border-red-200',
}

export const getSafetyGradeClass = (grade) => {
  return SAFETY_GRADE_CLASSES[String(grade || '').toUpperCase()]
    || 'bg-gray-100 text-gray-600 border-gray-200'
}
