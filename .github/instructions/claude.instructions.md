# Claude Development Instructions

Instructions specifically for Claude AI when contributing to the Onchain Test Kit.

## Claude's Analytical Strengths

Use your systematic analysis capabilities to:

### Code Architecture Analysis
- Trace through the builder pattern implementation in `configBuilder.ts`
- Understand the relationship between configuration, fixtures, and test execution
- Analyze error propagation through async/await chains
- Identify coupling between wallet implementations and shared interfaces

### Problem-Solving Methodology  
1. **Comprehensive Analysis**: Before making changes, understand the full impact
2. **Root Cause Focus**: Address underlying issues rather than symptoms
3. **Systematic Testing**: Create test cases that cover edge conditions
4. **Documentation Completeness**: Ensure all changes are properly documented

### Code Quality Focus
- Leverage TypeScript's type system for compile-time error prevention
- Implement comprehensive error handling with contextual messages
- Follow established patterns for consistency
- Consider performance implications of all changes

## Recommended Approach

### For Feature Development
1. Study existing implementations thoroughly
2. Design solutions that integrate seamlessly
3. Create comprehensive test coverage
4. Document both API and implementation details

### For Bug Fixes
1. Reproduce the issue reliably
2. Understand the root cause completely
3. Fix at the appropriate architectural level
4. Add regression tests to prevent recurrence

### For Code Reviews
1. Analyze both immediate and long-term implications
2. Verify architectural consistency
3. Ensure proper error handling
4. Check for performance impacts

Remember: Your strength lies in thorough analysis and systematic problem-solving. Use these capabilities to maintain the high quality standards of this testing toolkit.