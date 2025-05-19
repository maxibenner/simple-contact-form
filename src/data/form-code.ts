export function htmlForm(url: string) {
  return `<form action="${url}" method="POST">

    <!-- Add your form fields -->
    <input name="Email" type="email" required>
    <input name="Message" type="text" required>

    <!-- Add submit button -->
    <button type="submit">Submit Form</button>

</form>`
}

export function reactForm(url: string) {
  return `export default function ContactForm() {

  // Function to handle submission
  async function handleSubmit(e) {
    e.preventDefault();

    // Send form data to the server
    const res = await fetch("${url}", {
      method: "POST",
      body: new FormData(e.target),
    });

    // Handle response
    const data = await res.json();

    if (data.success) {
      // Handle success
    } else {
      // Handle error
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="Name" type="text" required />
      <input name="Email" type="email" required />
      <button type="submit">Submit</button>
    </form>
  );
}`
}
