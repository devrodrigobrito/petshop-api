import { app } from "./app";
import { env } from "./shared/config/env";

app.listen(env.PORT, () => {
  console.log(`Server is running on port ${env.PORT}`);
});
