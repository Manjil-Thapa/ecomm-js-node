module.exports = () => {
  // we dont really need the req obj
  return `
    <div>
        <form method="POST">
            <input name="email" placeholder="email" />
            <input name="password" placeholder="password" />
            <button>Sign in</button>
        </form>
    </div>
      `;
};