import { Box } from '@mui/material'

interface PageShellProps {
  children: React.ReactNode
}

const PageShell: React.FC<PageShellProps> = ({ children }) => {

  return (
    <Box
      sx={{
        p: { xs: 1, sm: 2 },
        '& > *': {
          animation: 'shellFade 400ms ease both',
        },
        '@keyframes shellFade': {
          from: { opacity: 0, transform: 'translateY(10px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
      }}
    >
      {children}
    </Box>
  )
}

export default PageShell
