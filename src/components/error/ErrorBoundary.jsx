import {Component} from "react";
import {Flex, Text, Title} from "@mantine/core";
import {IconAlertCircle} from "@tabler/icons-react";
import Button from "@/components/Button.jsx";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error(error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
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
