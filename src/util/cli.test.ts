import { Argument, IOption, options, removeDash } from './cli'

describe('class Argument test', () => {
    it('should be values when call getValue ', () => {
        const args = ['node', 'matrix', '-p=pyramid']
        const opt: IOption[] = [{ name: 'pattern', shortcut: 'p' }]
        const arg = new Argument(args, opt)
        expect(arg.getValue('p')).toEqual('pyramid')
    })

    it('should be values when call getValue ', () => {
        const args = ['node', 'matrix', '-d=10']
        const opt: IOption[] = [{ name: 'degree', shortcut: 'd' }]
        const arg = new Argument(args, opt)
        expect(arg.getValue('d')).toEqual('10')
    })

    it('should slice value', () => {
        expect(removeDash('-p')).toEqual('p')
    })

    it('should .. when call isValid function', () => {
        const args = ['node', 'matrix', '-d=10']
        const opt: IOption[] = [
            {
                name: 'pattern',
                shortcut: 'p',
                validation: () => {
                    return { isValid: true }
                }
            },
            {
                name: 'degree',
                shortcut: 'd',
                validation: () => {
                    return { errorMessage: 'occurred error' }
                }
            }
        ]
        const arg = new Argument(args, opt)
        const validCheck = arg.validationCheck
        expect(validCheck.isValid).toEqual(false)
        expect(validCheck.errorMessages).toEqual(['occurred error'])
    })

    it('should be default value when args is not contain option', () => {
        const args = ['node', 'matrix']
        const opt: IOption[] = [
            {
                defaultValue: 'pyramid',
                name: 'pattern',
                shortcut: 'p'
            }
        ]
        const arg = new Argument(args, opt)
        expect(arg.getDefaultValue('p')).toEqual('pyramid')
    })
})

describe('options test', () => {
    it('should be false when -p= is not pattern', () => {
        const args = ['node', 'matrix', '-p=hello', '-s=!', '-d=5']
        const arg = new Argument(args, options)
        const validCheck = arg.validationCheck
        expect(validCheck.isValid).toEqual(false)
        expect(validCheck.errorMessages).toEqual(['check the patterns'])
    })

    it('should be false when -s= is more than one', () => {
        const args = ['node', 'matrix', '-p=leftUpward', '-s=@@', '-d=$']
        const arg = new Argument(args, options)
        const validCheck = arg.validationCheck
        expect(validCheck.isValid).toEqual(false)
        expect(validCheck.errorMessages).toEqual(['degree must be a number', 'shape size is one'])
    })

    it('should be false when degree is over range', () => {
        const args = ['node', 'matrix', '-p=pyramid', '-s=!', '-d=-5']
        const arg = new Argument(args, options)
        const validCheck = arg.validationCheck
        expect(validCheck.isValid).toEqual(false)
        expect(validCheck.errorMessages).toEqual(['degree range is more than 0 and less than 30'])
    })

    it('should be false when get more than options', () => {
        const args = ['node', 'matrix', '-p=pyramiddd', '-s=!', '-d=5', '-e=']
        const arg = new Argument(args, options)
        const validCheck = arg.validationCheck
        expect(validCheck.isValid).toEqual(false)
        expect(validCheck.errorMessages).toEqual(['check the patterns'])
    })

    it('should be false when duplicated options', () => {
        const args = ['node', 'matrix', '-p=pyramid', '-s=!', '-d=5', '-s=@']
        const arg = new Argument(args, options)
        const validCheck = arg.validationCheck
        expect(validCheck.isValid).toEqual(false)
        expect(validCheck.errorMessages).toEqual(['Duplicated s options'])
    })
})
