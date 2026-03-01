# Notice: Mock Server Removed

The mock server that was originally published as part of this _version folder_ has been removed from this folder.

## Reason

This mock server was implemented in Node.js and its dependencies have become obsolete and potentially unsafe over time.
Maintaining these dependencies in older _versioned folders_ is incompatible with the immutable nature of released versions of the papiNet API standard.

## Conscious exception to the immutability rule

The papiNet Central Working Group (CWG) has consciously decided, during their meeting on the YYYY-MM-DD (Ddd), to make an exception to the immutability rule for this _versioned folder_, solely to remove the unsafe Node.js dependencies.
The normative content of this version remains unchanged.

## Replacement

Starting from version `2.0.0`, mock servers, now called stub servers, are distributed as [PACT](https://docs.pact.io/) files, which do not suffer from the same dependency management issues.
