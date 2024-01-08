async function main() {
  const url = `${process.env.HOST}/renew_assistant`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.TIMES_GPT_API_KEY}`,
    },
  });
  console.log(response);
}

main();
