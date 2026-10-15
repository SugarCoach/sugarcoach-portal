import { useMutation } from "@tanstack/react-query";
import { loginWithGoogleRequest } from "../services/authService";

export function useGoogleLoginMutation() {
  return useMutation({ mutationFn: loginWithGoogleRequest });
}
