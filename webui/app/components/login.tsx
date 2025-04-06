export default function LoginWithDiscordButton() {
    const loginUrl = "http://localhost:8000/login/discord/";
    return (
        <div className="button">
        <a href={loginUrl}>Login with Discord</a>
      </div>
    );
  }