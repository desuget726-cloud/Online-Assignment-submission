const requiredHeaders = ['full_name', 'user_id', 'email', 'department', 'role']

function parseRows(text) {
  const rows = []
  let row = []
  let cell = ''
  let quoted = false

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index]
    if (character === '"') {
      if (quoted && text[index + 1] === '"') {
        cell += '"'
        index += 1
      } else {
        quoted = !quoted
      }
    } else if (character === ',' && !quoted) {
      row.push(cell)
      cell = ''
    } else if ((character === '\n' || character === '\r') && !quoted) {
      if (character === '\r' && text[index + 1] === '\n') index += 1
      row.push(cell)
      if (row.some((value) => value.trim())) rows.push(row)
      row = []
      cell = ''
    } else {
      cell += character
    }
  }

  if (quoted) throw new Error('The CSV contains an unclosed quoted value.')
  row.push(cell)
  if (row.some((value) => value.trim())) rows.push(row)
  return rows
}

function cleanCell(value) {
  const trimmed = String(value || '').trim()
  if (/^[=+\-@]/.test(trimmed)) return ''
  return trimmed.replace(/<\/?[^>]+>/g, '').trim()
}

export function parseCsv(text) {
  const rows = parseRows(String(text || '').replace(/^\uFEFF/, ''))
  if (!rows.length) throw new Error('The file is empty.')

  const headers = rows[0].map((header) => cleanCell(header).toLowerCase())
  const missingHeaders = requiredHeaders.filter((header) => !headers.includes(header))
  if (missingHeaders.length) {
    throw new Error(`Missing required header${missingHeaders.length > 1 ? 's' : ''}: ${missingHeaders.join(', ')}.`)
  }
  if (new Set(headers).size !== headers.length) throw new Error('The CSV contains duplicate column headers.')

  const dataRows = rows.slice(1)
  if (dataRows.length > 1000) throw new Error('The file exceeds the 1,000-row limit.')
  return dataRows.map((values, index) => {
    const record = { rowNumber: index + 2 }
    headers.forEach((header, cellIndex) => {
      record[header] = cleanCell(values[cellIndex])
    })
    return record
  })
}

export const csvHeaders = requiredHeaders
