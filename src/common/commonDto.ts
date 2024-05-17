import { registerDecorator, ValidationOptions } from 'class-validator';

export function isValidaor(
  validationOptions?: ValidationOptions,
  values?: number[],
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isValidaor',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (values) {
            return values.includes(
              typeof value === 'string' ? Number(value) : value,
            );
          }
          return true;
        },
      },
    });
  };
}
