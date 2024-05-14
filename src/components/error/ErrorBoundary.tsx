import {Component, ErrorInfo, ReactNode} from "react";
import {Flex, Text, Title} from "@mantine/core";
import {IconAlertCircle} from "@tabler/icons-react";
import Button from "@/components/common/Button";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryStateProps {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryStateProps> {
  state: ErrorBoundaryStateProps = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryStateProps {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info.componentStack);
  }

  render() {
    if(this.state.hasError) {
      return (
        <Flex direction="column" justify="center" align="center" h="100vh">
          <IconAlertCircle size={50} color="gray" />
          <Title size="h5" mt={8}>Something went wrong</Title>
          <Text size="sm" mb={12}>There was a problem processing the request.</Text>
          <Button onClick={() => window.location.reload()}>Reload</Button>
        </Flex>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
