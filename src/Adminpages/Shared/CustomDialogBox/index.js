import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
} from "@mui/material";

const CustomDialog = ({
  open,
  onClose,
  onSubmit,
  title,
  formik,
  fields = [],
}) => {

  const fieldSx = {
    "& .MuiOutlinedInput-root": {
      color: "var(--text-main)",
      background: "var(--input-bg)",
      borderRadius: "12px",

      "& fieldset": {
        borderColor: "var(--border)",
      },

      "&:hover fieldset": {
        borderColor: "var(--primary)",
      },

      "&.Mui-focused fieldset": {
        borderColor: "var(--primary)",
        boxShadow: "0 0 0 2px rgba(200,144,64,0.15)",
      },

      "& input": {
        color: "var(--text-main)",
      },

      "& textarea": {
        color: "var(--text-main)",
      },
    },

    "& .MuiInputLabel-root": {
      color: "var(--text-muted)",
    },

    "& .MuiInputLabel-root.Mui-focused": {
      color: "var(--primary)",
    },

    "& .MuiFormHelperText-root": {
      color: "#ff7b7b",
      marginLeft: "2px",
    },

    "& .MuiSvgIcon-root": {
      color: "var(--primary)",
    },
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          background: "var(--card-bg)",
          border: "1px solid var(--border)",
          borderRadius: "18px",
          backdropFilter: "blur(12px)",
          boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle
        sx={{
          color: "var(--text-main)",
          fontSize: "22px",
          fontWeight: 700,
          borderBottom: "1px solid var(--border)",
          background: "rgba(255,255,255,0.02)",
          py: 2,
        }}
      >
        {title}
      </DialogTitle>

      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          paddingTop: "24px !important",
          paddingBottom: "10px",
          background: "transparent",
        }}
      >
        {fields.map((field) => {
          const error =
            formik.touched[field.name] &&
            formik.errors[field.name];

          if (field.type === "select") {
            return (
              <TextField
                key={field.name}
                select
                fullWidth
                label={field.label}
                name={field.name}
                value={formik.values[field.name]}
                onChange={field.onChange || formik.handleChange}
                onBlur={formik.handleBlur}
                error={!!error}
                helperText={error}
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                sx={fieldSx}
                SelectProps={{
                  MenuProps: {
                    PaperProps: {
                      sx: {
                        background: "#111",
                        border: "1px solid var(--border)",
                        borderRadius: "12px",
                        mt: 1,

                        "& .MuiMenuItem-root": {
                          color: "var(--text-main)",

                          "&:hover": {
                            background:
                              "rgba(200,144,64,0.15)",
                          },

                          "&.Mui-selected": {
                            background:
                              "rgba(200,144,64,0.2)",
                          },

                          "&.Mui-selected:hover": {
                            background:
                              "rgba(200,144,64,0.25)",
                          },
                        },
                      },
                    },
                  },
                }}
              >
                {field.options.map((option) => (
                  <MenuItem
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            );
          }

          return (
            <TextField
              key={field.name}
              fullWidth
              label={field.label}
              name={field.name}
              type={field.type || "text"}
              value={formik.values[field.name]}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={!!error}
              helperText={error}
              variant="outlined"
              multiline={field.multiline}
              rows={field.rows || 1}
              disabled={field.disabled}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                style: {
                  padding: "13px",
                },

                inputMode:
                  field.inputProps?.inputMode || "text",

                onPaste: (e) => {
                  if (field.onPaste) {
                    field.onPaste(
                      e,
                      formik.setFieldValue
                    );
                  }
                },
              }}
              InputProps={{
                endAdornment:
                  field.InputProps?.endAdornment,

                sx: {
                  borderRadius: "12px",
                },
              }}
              sx={fieldSx}
            />
          );
        })}
      </DialogContent>

      <DialogActions
        sx={{
          borderTop: "1px solid var(--border)",
          padding: "18px 24px",
          background: "rgba(255,255,255,0.02)",
        }}
      >
        <Button
          onClick={onClose}
          disabled={formik.isSubmitting}
          variant="outlined"
          sx={{
            borderColor: "var(--border)",
            color: "var(--text-muted)",
            px: 3,
            py: 1,
            borderRadius: "10px",
            textTransform: "none",
            fontWeight: 600,

            "&:hover": {
              borderColor: "var(--primary)",
              color: "var(--text-main)",
              background:
                "rgba(200,144,64,0.08)",
            },
          }}
        >
          Cancel
        </Button>

        <Button
          onClick={onSubmit}
          variant="contained"
          disabled={formik.isSubmitting}
          sx={{
            background: "var(--primary)",
            color: "#000",
            px: 3,
            py: 1,
            borderRadius: "10px",
            textTransform: "none",
            fontWeight: 700,
            boxShadow: "none",

            "&:hover": {
              background: "var(--primary-hover)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            },

            "&.Mui-disabled": {
              background: "#555",
              color: "#aaa",
            },
          }}
        >
          {formik.isSubmitting
            ? "Submitting..."
            : "Submit"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomDialog;