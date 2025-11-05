import { useUserStore } from "@/stores/userStore";

export default function UserName() {
  // Acessa o estado diretamente para criar subscription reativa
  const user = useUserStore((state) => state.user);
  const userFirstName = user?.username ? user.username.split(" ")[0] : "Guest";

  return <span>{userFirstName}</span>;
}
