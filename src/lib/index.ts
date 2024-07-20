// place files you want to import through the `$lib` alias in this folder.

export const fetchData = async(sheet: string) => {
  const response = await fetch(`https://cloud.plamour.club/data/12F00liFHAf4rvB6N7ZqjxdRyVAgA444bMzPEvyhr3Q8/${sheet}`)
  const data = await response.json()
  return data
}
