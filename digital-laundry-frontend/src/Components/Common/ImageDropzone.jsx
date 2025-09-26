import {
  Box,
  Paper,
  Typography,
  IconButton,
  useTheme,
  InputLabel,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
// import { useDropzone } from 'react-dropzone';
import { AWS_URL } from "@/ApiSetUp/AuthApi";

const ImageDropzone = ({
  onDrop,
  onDelete,
  title,
  imagePreview,
  error,
  helperText,
  valid = false,
  fontWeight,
  labelSize,
  labelColor,
  whiteSpace,
}) => {
  const theme = useTheme();
  // const { getRootProps, getInputProps, isDragActive } = useDropzone({
  // 	onDrop,
  // 	accept: {
  // 		'image/*': ['.jpeg', '.jpg', '.png'],
  // 	},
  // 	maxFiles: 1,
  // });

  return (
    <Box>
      {title && (
        <Box mb={0.5} display="flex" flexDirection="row">
          <InputLabel
            sx={{
              mb: { lg: "4px", xl: "8px" },
              fontWeight: fontWeight || 500,
              fontSize: labelSize || "16px",
              color: error
                ? theme.palette.error.main
                : labelColor || theme.palette.text.secondary,
              whiteSpace: whiteSpace ? "wrap" : "nowrap",
            }}
          >
            {title}
          </InputLabel>
          {valid && (
            <Typography color={theme.palette.error.main} variant="body2">
              *
            </Typography>
          )}
        </Box>
      )}

      <Paper
        {...getRootProps()}
        sx={{
          p: 3,
          border: "2px dashed",
          borderColor: isDragActive ? "primary.main" : "primary.light",
          backgroundColor: isDragActive ? "primary.50" : "background.paper",
          cursor: "pointer",
          transition: "all 0.3s ease",
          "&:hover": {
            borderColor: "primary.main",
            backgroundColor: "primary.50",
          },
        }}
      >
        <input {...getInputProps()} />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <CloudUploadIcon color="primary" sx={{ fontSize: 40 }} />
          <Typography textAlign="center" color="text.secondary">
            {isDragActive
              ? "Drop the image here"
              : "Drag & drop an image here, or click to select"}
          </Typography>
        </Box>
      </Paper>

      {imagePreview && (
        <Paper
          sx={{
            mt: 2,
            p: 1,
            backgroundColor: "grey.50",
            position: "relative",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <img
              src={`${AWS_URL}${imagePreview}`}
              alt="Preview"
              style={{
                maxWidth: "150px",
                maxHeight: "150px",
                width: "auto",
                height: "auto",
                objectFit: "contain",
                borderRadius: "4px",
              }}
            />
            <IconButton
              onClick={onDelete}
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  color: "error.main",
                },
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </Paper>
      )}

      {/* Error message */}
      {error && helperText && (
        <Typography
          variant="caption"
          sx={{
            color: "error.main",
            mt: 1,
            display: "block",
            fontSize: "12px",
          }}
        >
          {helperText}
        </Typography>
      )}
    </Box>
  );
};

export default ImageDropzone;
