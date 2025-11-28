import z from 'zod'
import { isArray, isObject } from './DataMigration'

export const ValidationSchemaShape = (value: any, key: any = 'key') => {
  if (isArray(value) && value.length > 0) {
    let schemaShape: any = {}
    value.forEach((field: any) => {
      schemaShape = {...schemaShape, ...generateSchema(field, key)}
    })
    console.log('schemaShape', schemaShape)
    return schemaShape
  }
  if (isObject(value)) {
    return generateSchema(value, key)
  }
  return {}
}

const generateSchema = (value: any, key: any = 'key') => {
  let schemaShape: any = {}
  const keyName = value[key] || ''
  const fieldName = value?.labels?.plural || value?.customLabel || value?.label
  const isDomain = keyName === 'domain'
  const isNumber = value?.fieldType === 'number'
  const isDate = value?.fieldType === 'date'
  const isRadio = value?.fieldType === 'radio'
  const isCheckbox = value?.fieldType === 'checkbox'
  const isBooleanCheckbox = value?.fieldType === 'booleancheckbox'


  if (value?.requiredField && value?.fieldRole === 'OBJECTS') {
    schemaShape[keyName] = z
      .any()
      .refine((val: any) => Array.isArray(val) && val.length > 0, {
        message: `${fieldName} must be a non-empty list.`,
      })
  } else if (
    (value?.requiredField || value?.primaryProperty) &&
    !isDomain &&
    !isNumber &&
    !isDate &&
    !isCheckbox &&
    !isBooleanCheckbox &&
    !isRadio
  ) {
    schemaShape[keyName] = z.string().nonempty({
      message: `${fieldName} is required.`,
    })
  } else if (isNumber) {
    if (value?.requiredField) {
      // REQUIRED number
      schemaShape[keyName] = z
        .string()
        .nonempty({
          message: `${fieldName} is required`,
        })
        .refine(
          (value: any) => value === null || value === '' || /^\d+$/.test(value),
          {
            message: `Invalid ${fieldName}`,
          },
        )
    } else {
      // OPTIONAL number
      schemaShape[keyName] = z
        .string()
        .nullable()
        .optional()
        .refine(
          (value: any) => value === null || value === '' || /^\d+$/.test(value),
          {
            message: `Invalid ${fieldName}`,
          },
        )
    }
  } else if (isDate) {
    if (value?.requiredField) {
      schemaShape[keyName] = z
        .any()
        .refine((val) => val !== null && val !== undefined && val !== '', {
          message: `${fieldName} is required`,
        })
    } else {
      schemaShape[keyName] = z.any().nullable().optional()
    }
  } else if (isDomain) {
    schemaShape[keyName] = z.string().refine(
      (value) => {
        const domainRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        return domainRegex.test(value)
      },
      {
        message: 'Invalid domain format',
      },
    )
  } else if (isCheckbox) {
    if (value?.requiredField) {
      schemaShape[keyName] = z
        .any()
        .refine((val) => val !== null && val !== undefined && val !== '', {
          message: `${fieldName} is required`,
        })
    } else {
      schemaShape[keyName] = z.any().nullable().optional()
    }
  } else if (isRadio) {
    if (value?.requiredField) {
      schemaShape[keyName] = z
        .any()
        .refine((val) => val !== null && val !== undefined && val !== '', {
          message: `${fieldName} is required`,
        })
    } else {
      schemaShape[keyName] = z.any().nullable().optional()
    }
  } else if (isBooleanCheckbox) {
      schemaShape[value?.key] = z
        .union([z.boolean(), z.string()])
        .transform((val) => {
          if (val === true || val === false) return val;
          if (typeof val === "string") {
            if (val.toLowerCase() === "true") return true;
            if (val.toLowerCase() === "false") return false;
          }
          return false; // default fallback value
        });
    } else {
      if (value?.fieldRole === 'OBJECTS') {
        schemaShape[keyName] = z.any().nullable()
      } else {
        schemaShape[keyName] = z.string().nullable()
      }
  }
  return schemaShape
}
