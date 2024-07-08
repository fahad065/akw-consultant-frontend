export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const file = await $fetch(body.url);
  return file
})