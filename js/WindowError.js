window.onerror = function (message, source, lineno, colno, error,ReferenceError) {
    console.info('Caught a ReferenceError:', message);
    console.info('Source:', source);
    console.info('Line:', lineno);
    console.info('Column:', colno);
    console.info('Error:', error);
    console.info('Error:', ReferenceError);

    // Prepare the error details object
    const errorDetails = {
      message: message,
      source: source,
      lineno: lineno,
      colno: colno,
      errorStack: error && error.stack ? error.stack : 'No stack trace available',
    };

    // Show the modal with the error message and details
    showErrorModal(errorDetails);

    // Return true to prevent the default browser error behavior (blank screen)
    return true;
  };

  // Function to display the modal with error details
  function showErrorModal(errorDetails) {
    const modal = document.getElementById('errorModal');
    const errorText = document.getElementById('errorMessage');
    const errorDetailsText = document.getElementById('errorDetails');

    // Display the error message in the modal
    errorText.textContent = errorDetails.message;

    // Display the error details (formatted) in the modal
    errorDetailsText.textContent = `Source: ${errorDetails.source}\nLine: ${errorDetails.lineno}, Column: ${errorDetails.colno}\n\nStack Trace:\n${errorDetails.errorStack}`;

    modal.style.display = 'flex';  // Show the modal
  }

  // Function to go back to the previous page
  function goBack() {
    window.history.back();  // Navigate back to the previous page
    closeModal();
    setTimeout(() => {
        window.location.reload();
    }, 100); // Add a slight delay to allow the modal to close smoothly
  }

  // Function to refresh the current page
  function refreshPage() {
    window.location.reload();  // Refresh the current page
    closeModal();
  }

  // Close the modal
  function closeModal() {
    const modal = document.getElementById('errorModal');
    modal.style.display = 'none';  // Hide the modal
  }
