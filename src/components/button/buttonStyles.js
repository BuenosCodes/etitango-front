const primaryButton = {
    width: '115px', 
    padding: '12px, 32px, 12px, 32px', 
    borderRadius: '25px', 
    backgroundColor: 'principal.secondary', 
    height: '44px', '&:hover': { backgroundColor: 'principal.secondary', }
}

const smallPrimaryButton = {
    width: '96px', 
    height: '40px', '&:hover': { backgroundColor: 'principal.secondary', },
    padding: '12px, 32px', 
    borderRadius: '12px', 
    backgroundColor: 'principal.secondary', 
}

const smallPrimaryButtonOutLine = {
    width: '96px', 
    height: '40px', 
    '&:hover': { backgroundColor: 'transparent', borderColor: 'greyScale.500' },
    padding: '12px, 32px, 12px, 32px', 
    borderRadius: '12px',
    borderColor: 'greyScale.500', 
    borderWidth: '1px'
}

const largePrimaryButton = {
    width: '100%',
    height: '54px', 
    '&:hover': { backgroundColor: 'principal.secondary', },
    backgroundColor: 'principal.secondary',
    padding: '12px, 32px', 
    borderRadius: '100px', 
}

const mediumPrimaryButton = {
    width: '178px',
    height: '58px', '&:hover': { backgroundColor: 'principal.secondary', },
    borderRadius: '100px', 
    backgroundColor: 'principal.secondary',
    padding: '18px, 16px',
}

export default { primaryButton, smallPrimaryButton, smallPrimaryButtonOutLine, largePrimaryButton, mediumPrimaryButton }