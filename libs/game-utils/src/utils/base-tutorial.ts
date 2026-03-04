type TutorialStep = {
  key: string;
  action: () => void;
};

class BaseTutorial {
  private currentStepIndex = 0;
  private currentStepKey: string | null = null;
  private steps: TutorialStep[];

  public constructor(steps: TutorialStep[]) {
    this.steps = steps;
  }

  public getCurrentStep() {
    return this.currentStepKey;
  }

  public start() {
    this.currentStepIndex = 0;
    this.currentStepKey = this.currentStep().key;
    this.executeStep();
  }

  public hasNextStep(): boolean {
    return this.currentStepIndex < this.steps.length - 1;
  }

  public nextStep() {
    if (!this.hasNextStep()) {
      this.currentStepKey = null;
      return;
    }

    this.currentStepIndex++;
    this.currentStepKey = this.currentStep().key;
    this.executeStep();
  }

  private currentStep() {
    return this.steps[this.currentStepIndex];
  }

  private executeStep() {
    const currentStep = this.currentStep();

    if (currentStep) {
      currentStep.action();
    }
  }
}

export { BaseTutorial, type TutorialStep };
