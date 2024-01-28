import * as apiClient from "../api-client";
import { useMutation, useQueryClient } from "react-query";
// import { useNavigate } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";

const SignOutButton = () => {
  const { showToast } = useAppContext();
  const queryClient = useQueryClient();
  //   const navigate = useNavigate();
  const mutation = useMutation(apiClient.signOut, {
    onSuccess: async () => {
      // console.log("User has signed in Successfully");
      await queryClient.invalidateQueries("validateToken");
      showToast({ message: "Sign Out Successfull", type: "SUCCESS" });
      //   navigate("/");
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: "ERROR" });
    },
  });
  const handleClick = () => {
    mutation.mutate();
  };
  return (
    <button
      onClick={handleClick}
      className="text-blue-600 px-3 font-bold bg-white hover:bg-gray-100"
    >
      SignOut
    </button>
  );
};

export default SignOutButton;
