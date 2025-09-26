// import { responseEnum } from "./enum";

export default function ErrorHandler(data, setSnackBar) {
  console.log(data, "res2");
  if (data?.payload?.data?.success === false) {
    console.log(data, "res2");
    setSnackBar("error", data?.payload?.data?.message);
    return false;
  } else {
    return true;
  }
}

// export default function ErrorHandler(data, setSnackBar) {
// 	if (data?.payload?.data?.data?.code === responseEnum.FailureCode) {
// 		setSnackBar('error', data?.payload?.data?.message);
// 		return false;
// 	} else if (data?.payload?.status === responseEnum.InternalServerCode) {
// 		setSnackBar('error', data?.payload?.statusText);
// 		return false;
// 	} else if (data?.payload?.status === responseEnum.ValidationCode) {
// 		setSnackBar('error', data.payload.message);
// 		return false;
// 	} else {
// 		return true;
// 	}
// }
