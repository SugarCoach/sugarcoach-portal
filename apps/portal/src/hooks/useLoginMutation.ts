import { useMutation } from "@tanstack/react-query";
import { loginRequest } from "../services/authService";

export function useLoginMutation() {
  return useMutation({ mutationFn: loginRequest });
}
