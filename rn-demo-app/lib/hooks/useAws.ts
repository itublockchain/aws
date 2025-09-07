import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import awsService from "@/lib/api/services/awsService";

interface AWSResponse {
  publicKey: string;
  ensName: bigint;
}

// Hook to get AWS name for a given hash
export const useGetAWSName = (hash: string | undefined) => {
  return useQuery<AWSResponse>({
    queryKey: ["aws-name", hash],
    queryFn: () => awsService.getAWSName(hash!),
    enabled: !!hash,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook to set AWS name
export const useSetAWSName = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ hash, publicKey }: { hash: string; publicKey: string }) =>
      awsService.setAWSName(hash, publicKey),
    onSuccess: (data, variables) => {
      // Invalidate and refetch AWS name query
      queryClient.invalidateQueries({
        queryKey: ["aws-name", variables.hash],
      });
    },
    onError: (error) => {
      console.error("Error setting AWS name:", error);
    },
  });
};

// Combined hook to check if user has AWS and set it if not
export const useAWSManagement = (hash: string | undefined, publicKey: string | undefined) => {
  const { data: awsData, isLoading: isCheckingAWS, error: awsError } = useGetAWSName(hash);
  const setAWSMutation = useSetAWSName();

  const hasAWS = awsData && 
    awsData.publicKey && 
    awsData.publicKey !== "0x0000000000000000000000000000000000000000";
  
  const setAWSIfNotExists = async () => {
    if (!hash || !publicKey) {
      throw new Error("Hash and publicKey are required");
    }
    
    if (!hasAWS) {
      return setAWSMutation.mutateAsync({ hash, publicKey });
    }
  };

  return {
    hasAWS,
    awsData,
    isCheckingAWS,
    awsError,
    setAWSIfNotExists,
    isSettingAWS: setAWSMutation.isPending,
    setAWSError: setAWSMutation.error,
    setAWSSuccess: setAWSMutation.isSuccess,
  };
};
