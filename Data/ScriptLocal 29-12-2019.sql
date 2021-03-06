USE [TashtyVer3_2]
GO
/****** Object:  User [tashtyman]    Script Date: 12/29/2019 3:46:37 PM ******/
CREATE USER [tashtyman] WITHOUT LOGIN WITH DEFAULT_SCHEMA=[dbo]
GO
/****** Object:  Schema [Log]    Script Date: 12/29/2019 3:46:37 PM ******/
CREATE SCHEMA [Log]
GO
/****** Object:  Schema [Lookup]    Script Date: 12/29/2019 3:46:37 PM ******/
CREATE SCHEMA [Lookup]
GO
/****** Object:  Schema [Product]    Script Date: 12/29/2019 3:46:37 PM ******/
CREATE SCHEMA [Product]
GO
/****** Object:  Schema [Profile]    Script Date: 12/29/2019 3:46:37 PM ******/
CREATE SCHEMA [Profile]
GO
/****** Object:  UserDefinedTableType [Product].[AddressOrders]    Script Date: 12/29/2019 3:46:37 PM ******/
CREATE TYPE [Product].[AddressOrders] AS TABLE(
	[orderID] [int] NULL,
	[price] [nvarchar](max) NULL,
	[comment] [nvarchar](max) NULL
)
GO
/****** Object:  UserDefinedTableType [Product].[DealItem]    Script Date: 12/29/2019 3:46:37 PM ******/
CREATE TYPE [Product].[DealItem] AS TABLE(
	[itemID] [int] NULL,
	[dealID] [int] NOT NULL,
	[mealID] [int] NOT NULL,
	[isDeleted] [bit] NOT NULL
)
GO
/****** Object:  UserDefinedTableType [Product].[DealItems]    Script Date: 12/29/2019 3:46:37 PM ******/
CREATE TYPE [Product].[DealItems] AS TABLE(
	[dealID] [int] NOT NULL,
	[mealID] [int] NOT NULL,
	[isDeleted] [bit] NOT NULL
)
GO
/****** Object:  UserDefinedTableType [Product].[DealMealItem]    Script Date: 12/29/2019 3:46:37 PM ******/
CREATE TYPE [Product].[DealMealItem] AS TABLE(
	[itemID] [int] NULL,
	[dealID] [int] NULL,
	[mealID] [int] NOT NULL,
	[isDeleted] [bit] NOT NULL
)
GO
/****** Object:  UserDefinedTableType [Product].[GalleryItems]    Script Date: 12/29/2019 3:46:37 PM ******/
CREATE TYPE [Product].[GalleryItems] AS TABLE(
	[galleryID] [int] NULL,
	[filename] [nvarchar](max) NULL,
	[isActive] [bit] NULL,
	[isDeleted] [bit] NULL
)
GO
/****** Object:  UserDefinedTableType [Product].[MealType]    Script Date: 12/29/2019 3:46:37 PM ******/
CREATE TYPE [Product].[MealType] AS TABLE(
	[mealTypeID] [int] NULL,
	[typeID] [int] NULL,
	[isDeleted] [bit] NULL
)
GO
/****** Object:  UserDefinedTableType [Product].[OrderAddOns]    Script Date: 12/29/2019 3:46:37 PM ******/
CREATE TYPE [Product].[OrderAddOns] AS TABLE(
	[orderID] [int] NULL,
	[optionID] [int] NULL
)
GO
/****** Object:  UserDefinedTableType [Product].[OrderItems]    Script Date: 12/29/2019 3:46:37 PM ******/
CREATE TYPE [Product].[OrderItems] AS TABLE(
	[mealID] [int] NULL,
	[dealID] [int] NULL,
	[quantity] [int] NULL,
	[comment] [nvarchar](max) NULL
)
GO
/****** Object:  UserDefinedTableType [Profile].[UserAddress]    Script Date: 12/29/2019 3:46:37 PM ******/
CREATE TYPE [Profile].[UserAddress] AS TABLE(
	[addressTypeID] [int] NOT NULL,
	[countryID] [int] NOT NULL,
	[cityID] [int] NOT NULL,
	[postalCode] [nvarchar](150) NULL,
	[address] [nvarchar](500) NULL
)
GO
/****** Object:  UserDefinedFunction [dbo].[fn_StripCharacters]    Script Date: 12/29/2019 3:46:37 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE FUNCTION [dbo].[fn_StripCharacters]
(
    @String NVARCHAR(MAX), 
    @MatchExpression VARCHAR(255)
)
RETURNS NVARCHAR(MAX)
AS
BEGIN
    SET @MatchExpression =  '%['+@MatchExpression+']%'

    WHILE PatIndex(@MatchExpression, @String) > 0
        SET @String = Stuff(@String, PatIndex(@MatchExpression, @String), 1, '')

    RETURN @String

END
GO
/****** Object:  UserDefinedFunction [dbo].[Function_Split]    Script Date: 12/29/2019 3:46:37 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Saadia Nada
-- Create date: 26,June;201
-- Description:	Generating New Quiz
-- =============================================

CREATE function [dbo].[Function_Split](
 @String nvarchar(max),
 @SplitChar nvarchar(5)
)  
RETURNS @RtnValue table 
( 
 no int,
 SplitResult nvarchar(1000)
) 
AS  
BEGIN 

 declare @no int

 set @no = 0
 While (Charindex(@SplitChar,@String)>0)
 Begin
  set @no = @no + 1
  Insert Into @RtnValue (no, SplitResult)
   Select @no,ltrim(rtrim(Substring(@String,1,Charindex(@SplitChar,@String)-1)))

  Set @String = Substring(@String,Charindex(@SplitChar,@String)+1,len(@String))
  
 End
 
 set @no = @no + 1
 Insert Into @RtnValue (no, SplitResult)
  select @no, ltrim(rtrim(@String))

 Return
END

GO
/****** Object:  UserDefinedFunction [dbo].[RemoveNonAlphaCharacters]    Script Date: 12/29/2019 3:46:37 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
Create Function [dbo].[RemoveNonAlphaCharacters](@Temp VarChar(1000))
Returns VarChar(1000)
AS
Begin

    Declare @KeepValues as varchar(50)
    Set @KeepValues = '%[^a-z]%'
    While PatIndex(@KeepValues, @Temp) > 0
        Set @Temp = Stuff(@Temp, PatIndex(@KeepValues, @Temp), 1, '')

    Return @Temp
End
GO
/****** Object:  UserDefinedFunction [dbo].[udf_Cleanchars]    Script Date: 12/29/2019 3:46:37 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE FUNCTION [dbo].[udf_Cleanchars] (@InputString varchar(80)) 
RETURNS varchar(80) 
AS 

BEGIN 
declare @return varchar(80) , @length int , @counter int , @cur_char char(1) 
SET @return = '' 
SET @length = 0 
SET @counter = 1 
SET @length = LEN(@InputString) 
IF @length > 0 
BEGIN WHILE @counter <= @length 

BEGIN SET @cur_char = SUBSTRING(@InputString, @counter, 1) IF ((ascii(@cur_char) in (32,46)) or (ascii(@cur_char) between 48 and 57) or (ascii(@cur_char) between 65 and 90) or (ascii(@cur_char) between 97 and 122))
BEGIN SET @return = @return + @cur_char END 
SET @counter = @counter + 1 
END END 

RETURN @return END
GO
/****** Object:  UserDefinedFunction [dbo].[RemoveSpecialChars]    Script Date: 12/29/2019 3:46:37 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE function [dbo].[RemoveSpecialChars] (@s varchar(256)) returns varchar(256)
   with schemabinding
begin
   if @s is null
      return null
   declare @s2 varchar(256)
   --set @s2 = ''
   declare @l int
   set @l = len(@s)
   declare @p int
   set @p = 1
   while @p <= @l begin
      declare @c int
      set @c = ascii(substring(@s, @p, 1))
      if @c between 48 and 57 or @c between 65 and 90 or @c between 97 and 122
         set @s2 = @s2 + char(@c)
      set @p = @p + 1
      end
   if len(@s2) = 0
      return null
   return @s2
   end
GO
/****** Object:  Table [dbo].[tblContactUs]    Script Date: 12/29/2019 3:46:37 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tblContactUs](
	[contactUsID] [int] NOT NULL,
	[email] [nvarchar](50) NULL,
	[query] [nvarchar](max) NULL,
	[queryTypeID] [int] NULL,
	[queryStatusID] [int] NULL,
	[reply] [nvarchar](max) NULL,
	[isActive] [bit] NULL,
	[isDeleted] [bit] NULL,
	[dateModified] [datetime] NULL,
	[dateCreated] [datetime] NULL,
	[profileID] [int] NULL,
	[isSeller] [bit] NULL,
	[isBuyer] [bit] NULL,
	[modifiedBy] [int] NULL,
	[phone] [nvarchar](50) NULL,
	[name] [nvarchar](250) NULL,
 CONSTRAINT [PK_tblContactUs] PRIMARY KEY CLUSTERED 
(
	[contactUsID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tblLogDBError]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tblLogDBError](
	[errorLogID] [int] IDENTITY(1,1) NOT NULL,
	[errorNumber] [nvarchar](50) NULL,
	[errorSeverity] [nvarchar](250) NULL,
	[errorState] [nvarchar](250) NULL,
	[errorLine] [nvarchar](500) NULL,
	[errorProcedure] [nvarchar](500) NULL,
	[exceptionDetail] [nvarchar](max) NULL,
	[isActive] [bit] NULL,
	[isDeleted] [bit] NULL,
	[dateModified] [datetime] NULL,
	[dateCreated] [datetime] NULL,
	[DBUserName] [nvarchar](50) NULL,
	[SYSUserName] [nvarchar](50) NULL,
 CONSTRAINT [PK_tblLogDBError] PRIMARY KEY CLUSTERED 
(
	[errorLogID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tblLogFact]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tblLogFact](
	[factLogID] [int] NOT NULL,
	[totalComission] [nvarchar](500) NULL,
	[utcLogDate] [datetime] NULL,
	[isActive] [bit] NULL,
	[isDeleted] [bit] NULL,
	[dateModified] [datetime] NULL,
	[dateCreated] [datetime] NULL,
 CONSTRAINT [PK_tblLogFact] PRIMARY KEY CLUSTERED 
(
	[factLogID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tblLogforgotPassword]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tblLogforgotPassword](
	[forgotPasswordID] [int] IDENTITY(1,1) NOT NULL,
	[claimKey] [nvarchar](250) NULL,
	[claimDate] [datetime] NULL,
	[IsExpired] [bit] NULL,
	[profileID] [int] NULL,
	[isActive] [bit] NULL,
	[isDeleted] [bit] NULL,
	[dateModified] [datetime] NULL,
	[dateCreated] [datetime] NULL,
 CONSTRAINT [PK_tblLogforgotPassword] PRIMARY KEY CLUSTERED 
(
	[forgotPasswordID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tblLogLogin]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tblLogLogin](
	[logID] [int] IDENTITY(1,1) NOT NULL,
	[profileID] [int] NULL,
	[IPAddress] [nvarchar](150) NULL,
	[loginDate] [datetime] NULL,
	[isActive] [bit] NULL,
	[isDeleted] [bit] NULL,
	[dateModified] [datetime] NULL,
	[dateCreated] [datetime] NULL,
	[machineSignature] [nvarchar](250) NULL,
 CONSTRAINT [PK_tblLogLogin] PRIMARY KEY CLUSTERED 
(
	[logID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tblLogTimeline]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tblLogTimeline](
	[timelineID] [int] IDENTITY(1,1) NOT NULL,
	[description] [nvarchar](max) NULL,
	[profileID] [int] NULL,
	[isActive] [bit] NULL,
	[isDeleted] [bit] NULL,
	[dateModified] [datetime] NULL,
	[dateCreated] [datetime] NULL,
 CONSTRAINT [PK_tblLogTimeline] PRIMARY KEY CLUSTERED 
(
	[timelineID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tblNewsletters]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tblNewsletters](
	[newletterID] [int] IDENTITY(1,1) NOT NULL,
	[title] [nvarchar](500) NULL,
	[description] [nvarchar](max) NULL,
	[photo] [nvarchar](250) NULL,
	[datePublished] [datetime] NULL,
	[isActive] [bit] NULL,
	[isDeleted] [bit] NULL,
	[dateModified] [datetime] NULL,
	[dateCreated] [datetime] NULL,
 CONSTRAINT [PK_tblNewsletters] PRIMARY KEY CLUSTERED 
(
	[newletterID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tblNotification]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tblNotification](
	[notificationID] [int] NOT NULL,
	[senderID] [int] NULL,
	[receiverID] [int] NULL,
	[notice] [nvarchar](max) NULL,
	[notificationType] [int] NULL,
	[isRead] [bit] NULL,
	[isActive] [bit] NULL,
	[isDeleted] [bit] NULL,
	[dateModified] [datetime] NULL,
	[dateCreated] [datetime] NULL,
	[title] [nvarchar](500) NULL,
	[countryID] [int] NULL,
	[cityID] [int] NULL,
	[groupID] [int] NULL,
	[isGroupNotice] [bit] NULL,
	[noticeDate] [datetime] NULL,
	[modifiedBy] [int] NULL,
	[isSeller] [bit] NULL,
 CONSTRAINT [PK_tblNotification_1] PRIMARY KEY CLUSTERED 
(
	[notificationID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tblNotificationReadStatus]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tblNotificationReadStatus](
	[groupNotificateReadID] [int] NOT NULL,
	[groupNotificationID] [int] NULL,
	[profileID] [int] NULL,
	[readDate] [datetime] NULL,
	[isActive] [bit] NULL,
	[isDeleted] [bit] NULL,
 CONSTRAINT [PK_tblNotificationReadStatus] PRIMARY KEY CLUSTERED 
(
	[groupNotificateReadID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Lookup].[tblAddOnOptions]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Lookup].[tblAddOnOptions](
	[optionID] [int] NOT NULL,
	[addOnID] [int] NULL,
	[dateAdded] [datetime] NULL,
	[dateModified] [datetime] NULL,
	[isActive] [bit] NULL,
	[isDeleted] [bit] NULL,
	[title] [nvarchar](250) NULL,
	[price] [int] NULL,
 CONSTRAINT [PK_tblAddOnOptions] PRIMARY KEY CLUSTERED 
(
	[optionID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Lookup].[tblAddOns]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Lookup].[tblAddOns](
	[addOnID] [int] NOT NULL,
	[title] [nvarchar](250) NULL,
	[subCatID] [int] NULL,
	[description] [nvarchar](max) NULL,
	[dateCreated] [datetime] NULL,
	[dateModified] [datetime] NULL,
	[isActive] [bit] NULL,
	[isDeleted] [bit] NULL,
	[cntrl] [nvarchar](50) NULL,
 CONSTRAINT [PK_tblAddOns] PRIMARY KEY CLUSTERED 
(
	[addOnID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [Lookup].[tblAddressType]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Lookup].[tblAddressType](
	[addressTypeID] [int] NOT NULL,
	[addressType] [nvarchar](50) NULL,
	[isActive] [bit] NULL,
	[isDeleted] [bit] NULL,
	[dateModified] [datetime] NULL,
	[dateCreated] [datetime] NULL,
 CONSTRAINT [PK_tblAddressType] PRIMARY KEY CLUSTERED 
(
	[addressTypeID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Lookup].[tblCity]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Lookup].[tblCity](
	[cityID] [int] IDENTITY(1,1) NOT NULL,
	[countryID] [int] NULL,
	[province] [nvarchar](50) NULL,
	[city] [nvarchar](50) NULL,
	[isActive] [bit] NULL,
	[isDeleted] [bit] NULL,
	[dateModified] [datetime] NULL,
	[dateCreated] [datetime] NULL,
 CONSTRAINT [PK_tblCity] PRIMARY KEY CLUSTERED 
(
	[cityID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Lookup].[tblContactUsStatus]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Lookup].[tblContactUsStatus](
	[queryStatusID] [int] NOT NULL,
	[title] [nvarchar](50) NULL,
	[isActive] [bit] NULL,
	[isDeleted] [bit] NULL,
	[dateModified] [datetime] NULL,
	[dateCreated] [datetime] NULL,
 CONSTRAINT [PK_tblContactUsStatus] PRIMARY KEY CLUSTERED 
(
	[queryStatusID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Lookup].[tblContactUsType]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Lookup].[tblContactUsType](
	[queryTypeID] [int] NOT NULL,
	[title] [nvarchar](50) NULL,
	[isActive] [bit] NULL,
	[isDeleted] [bit] NULL,
	[dateModified] [datetime] NULL,
	[dateCreated] [datetime] NULL,
 CONSTRAINT [PK_tblContactUsType] PRIMARY KEY CLUSTERED 
(
	[queryTypeID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Lookup].[tblCountry]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Lookup].[tblCountry](
	[countryID] [int] NOT NULL,
	[country] [nvarchar](150) NULL,
	[currency] [int] NULL,
	[VAT] [nvarchar](150) NULL,
	[commisionValue] [nvarchar](150) NULL,
	[isActive] [bit] NULL,
	[isDeleted] [bit] NULL,
	[dateModified] [datetime] NULL,
	[dateCreated] [datetime] NULL,
	[distanceUnitID] [int] NULL,
	[isHalal] [bit] NULL,
	[dateActivated] [datetime] NULL,
	[modifiedBy] [int] NULL,
	[rateFrom] [nvarchar](250) NULL,
	[rateTo] [nvarchar](250) NULL,
	[rate] [nvarchar](50) NULL,
 CONSTRAINT [PK_tblCountry] PRIMARY KEY CLUSTERED 
(
	[countryID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Lookup].[tblCurrency]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Lookup].[tblCurrency](
	[currencyID] [int] NOT NULL,
	[title] [nvarchar](50) NULL,
	[description] [nvarchar](50) NULL,
	[isActive] [bit] NULL,
	[isDeleted] [bit] NULL,
	[dateModified] [datetime] NULL,
	[dateCreated] [datetime] NULL,
	[sign] [nvarchar](5) NULL,
 CONSTRAINT [PK_tblCurrency] PRIMARY KEY CLUSTERED 
(
	[currencyID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Lookup].[tblDiscount]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Lookup].[tblDiscount](
	[DiscountID] [int] NOT NULL,
	[DiscountTypeID] [int] NOT NULL,
	[DiscountStartDate] [datetime] NOT NULL,
	[DiscountEndDate] [datetime] NOT NULL,
	[IsDiscountCoupin] [int] NOT NULL,
	[DiscountDuration] [int] NULL,
	[title] [nvarchar](250) NULL,
	[description] [nvarchar](max) NULL,
	[dateCreated] [datetime] NULL,
	[dateModified] [datetime] NULL,
	[isActive] [bit] NULL,
	[isDeleted] [bit] NULL,
 CONSTRAINT [PK_tblDiscount] PRIMARY KEY CLUSTERED 
(
	[DiscountID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [Lookup].[tblDiscountType]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Lookup].[tblDiscountType](
	[DiscountTypeID] [int] NOT NULL,
	[title] [nvarchar](250) NULL,
	[description] [nvarchar](max) NULL,
	[dateCreated] [datetime] NULL,
	[dateModified] [datetime] NULL,
	[isActive] [bit] NULL,
	[isDeleted] [bit] NULL,
 CONSTRAINT [PK_tblDiscountType] PRIMARY KEY CLUSTERED 
(
	[DiscountTypeID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [Lookup].[tblDistanceUnit]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Lookup].[tblDistanceUnit](
	[unitID] [int] NOT NULL,
	[unit] [nvarchar](50) NULL,
	[description] [nvarchar](50) NULL,
	[isActive] [bit] NULL,
	[isDeleted] [bit] NULL,
	[dateModified] [datetime] NULL,
	[dateCreated] [datetime] NULL,
 CONSTRAINT [PK_tblDistanceUnit] PRIMARY KEY CLUSTERED 
(
	[unitID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Lookup].[tblFolderType]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Lookup].[tblFolderType](
	[folderTypeID] [int] NOT NULL,
	[name] [nvarchar](50) NULL,
	[description] [nvarchar](50) NULL,
	[roleID] [int] NULL,
	[isActive] [bit] NULL,
	[isDeleted] [bit] NULL,
	[dateModified] [datetime] NULL,
	[dateCreated] [datetime] NULL,
 CONSTRAINT [PK_tblFolderType] PRIMARY KEY CLUSTERED 
(
	[folderTypeID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Lookup].[tblGalleryType]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Lookup].[tblGalleryType](
	[galleryTypeID] [int] NOT NULL,
	[title] [nvarchar](50) NULL,
	[description] [nvarchar](50) NULL,
	[isActive] [bit] NULL,
	[isDeleted] [bit] NULL,
	[dateModified] [datetime] NULL,
	[dateCreated] [datetime] NULL,
 CONSTRAINT [PK_tblGalleryType] PRIMARY KEY CLUSTERED 
(
	[galleryTypeID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Lookup].[tblGender]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Lookup].[tblGender](
	[genderID] [int] NOT NULL,
	[name] [nvarchar](150) NULL,
	[isActive] [bit] NULL,
	[isDeleted] [bit] NULL,
	[dateModified] [datetime] NULL,
	[dateCreated] [datetime] NULL,
 CONSTRAINT [PK_tblGender] PRIMARY KEY CLUSTERED 
(
	[genderID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Lookup].[tblMaritalStatus]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Lookup].[tblMaritalStatus](
	[maritalStatusID] [int] NOT NULL,
	[maritalStatusName] [nvarchar](150) NULL,
	[isActive] [bit] NULL,
	[isDeleted] [bit] NULL,
	[dateModified] [datetime] NULL,
	[dateCreated] [datetime] NULL,
 CONSTRAINT [PK_tblMaritalStatus] PRIMARY KEY CLUSTERED 
(
	[maritalStatusID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Lookup].[tblMealType]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Lookup].[tblMealType](
	[mealTypeID] [int] NOT NULL,
	[name] [nvarchar](150) NULL,
	[isActive] [bit] NULL,
	[isDeleted] [bit] NULL,
	[dateModified] [datetime] NULL,
	[dateCreated] [datetime] NULL,
 CONSTRAINT [PK_tblMealType] PRIMARY KEY CLUSTERED 
(
	[mealTypeID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Lookup].[tblNotificationGroup]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Lookup].[tblNotificationGroup](
	[notificationGroupID] [int] NOT NULL,
	[title] [nvarchar](50) NULL,
	[description] [nvarchar](250) NULL,
	[isActive] [bit] NULL,
	[isDeleted] [bit] NULL,
	[dateModified] [datetime] NULL,
	[dateCreated] [datetime] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [Lookup].[tblNotificationType]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Lookup].[tblNotificationType](
	[notificationTypeID] [int] NOT NULL,
	[title] [nvarchar](50) NULL,
	[description] [nvarchar](250) NULL,
	[isActive] [bit] NULL,
	[isDeleted] [bit] NULL,
	[dateModified] [datetime] NULL,
	[dateCreated] [datetime] NULL,
 CONSTRAINT [PK_tblNotificationType] PRIMARY KEY CLUSTERED 
(
	[notificationTypeID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Lookup].[tblOfferType]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Lookup].[tblOfferType](
	[OfferTypeID] [int] NOT NULL,
	[title] [nvarchar](250) NULL,
	[description] [nvarchar](max) NULL,
	[dateCreated] [datetime] NULL,
	[dateModified] [datetime] NULL,
	[isActive] [bit] NULL,
	[isDeleted] [bit] NULL,
 CONSTRAINT [PK_tblOfferType] PRIMARY KEY CLUSTERED 
(
	[OfferTypeID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [Lookup].[tblOrderStatus]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Lookup].[tblOrderStatus](
	[orderStatusID] [int] IDENTITY(1,1) NOT NULL,
	[status] [nvarchar](250) NULL,
	[isActive] [bit] NULL,
	[isDeleted] [bit] NULL,
	[dateModified] [datetime] NULL,
	[dateCreated] [datetime] NULL,
 CONSTRAINT [PK_tblOrderStatus] PRIMARY KEY CLUSTERED 
(
	[orderStatusID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Lookup].[tblPaymentMethod]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Lookup].[tblPaymentMethod](
	[PaymentMethodID] [int] NOT NULL,
	[title] [nvarchar](250) NULL,
	[description] [nvarchar](max) NULL,
	[dateCreated] [datetime] NULL,
	[dateModified] [datetime] NULL,
	[isActive] [bit] NULL,
	[isDeleted] [bit] NULL,
 CONSTRAINT [PK_tblPaymentMethod] PRIMARY KEY CLUSTERED 
(
	[PaymentMethodID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [Lookup].[tblPaymentMethodCountry]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Lookup].[tblPaymentMethodCountry](
	[PaymentMethodCountryID] [int] NOT NULL,
	[CountryID] [int] NOT NULL,
	[PaymentMethodID] [int] NOT NULL,
	[dateCreated] [datetime] NULL,
	[dateModified] [datetime] NULL,
	[isActive] [bit] NULL,
	[isDeleted] [bit] NULL,
 CONSTRAINT [PK_tblPaymentMethodCountry] PRIMARY KEY CLUSTERED 
(
	[PaymentMethodCountryID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Lookup].[tblPaymentStatus]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Lookup].[tblPaymentStatus](
	[paymentStatusID] [int] NOT NULL,
	[title] [nvarchar](50) NULL,
	[description] [nvarchar](500) NULL,
	[dateModified] [datetime] NULL,
	[isDeleted] [bit] NULL,
	[isActive] [bit] NULL,
	[DateCreated] [datetime] NULL,
 CONSTRAINT [PK_tblPaymentStatus] PRIMARY KEY CLUSTERED 
(
	[paymentStatusID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Lookup].[tblPaymentType]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Lookup].[tblPaymentType](
	[PaymentTypeID] [int] NOT NULL,
	[title] [nvarchar](250) NULL,
	[description] [nvarchar](max) NULL,
	[dateCreated] [datetime] NULL,
	[dateModified] [datetime] NULL,
	[isActive] [bit] NULL,
	[isDeleted] [bit] NULL,
 CONSTRAINT [PK_tblPaymentType] PRIMARY KEY CLUSTERED 
(
	[PaymentTypeID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [Lookup].[tblRating]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Lookup].[tblRating](
	[ratingID] [int] NOT NULL,
	[ratingNumber] [int] NULL,
	[description] [nvarchar](500) NULL,
	[isActive] [bit] NULL,
	[isDeleted] [bit] NULL,
	[dateModified] [datetime] NULL,
	[dateCreated] [datetime] NULL,
 CONSTRAINT [PK_tblRating] PRIMARY KEY CLUSTERED 
(
	[ratingID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Lookup].[tblRegisterationStatus]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Lookup].[tblRegisterationStatus](
	[registrationStatusID] [int] NOT NULL,
	[registrationStatus] [nvarchar](50) NULL,
	[isActive] [bit] NULL,
	[isDeleted] [bit] NULL,
	[dateModified] [datetime] NULL,
	[dateCreated] [datetime] NULL,
 CONSTRAINT [PK_tblRegisterationStatus] PRIMARY KEY CLUSTERED 
(
	[registrationStatusID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Lookup].[tblRequestStatus]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Lookup].[tblRequestStatus](
	[requestStatusID] [int] NOT NULL,
	[title] [nvarchar](500) NULL,
	[description] [nvarchar](max) NULL,
	[isDeleted] [bit] NULL,
	[isActive] [bit] NULL,
	[dateCreated] [datetime] NULL,
	[dateModified] [datetime] NULL,
 CONSTRAINT [PK_tblRequestStatus] PRIMARY KEY CLUSTERED 
(
	[requestStatusID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [Lookup].[tblRole]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Lookup].[tblRole](
	[roleID] [int] IDENTITY(1,1) NOT NULL,
	[roleName] [nvarchar](50) NULL,
	[isActive] [bit] NULL,
	[isDeleted] [bit] NULL,
	[dateCreated] [datetime] NULL,
	[dateModified] [datetime] NULL,
 CONSTRAINT [PK_Lookup.tblRole] PRIMARY KEY CLUSTERED 
(
	[roleID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Lookup].[tblSellerPaymentSetting]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Lookup].[tblSellerPaymentSetting](
	[SellerPaymentSettingID] [int] NOT NULL,
	[SellerID] [int] NOT NULL,
	[ActualAmount] [int] NOT NULL,
	[CompanyPercentage] [int] NOT NULL,
	[title] [nvarchar](250) NULL,
	[description] [nvarchar](max) NULL,
	[dateCreated] [datetime] NULL,
	[dateModified] [datetime] NULL,
	[isActive] [bit] NULL,
	[isDeleted] [bit] NULL,
 CONSTRAINT [PK_tblSellerPaymentSetting] PRIMARY KEY CLUSTERED 
(
	[SellerPaymentSettingID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [Lookup].[tblTag]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Lookup].[tblTag](
	[TagID] [int] NOT NULL,
	[TagTypeID] [int] NOT NULL,
	[MealID] [int] NOT NULL,
	[CreatedBy] [int] NOT NULL,
	[title] [nvarchar](250) NULL,
	[description] [nvarchar](max) NULL,
	[dateCreated] [datetime] NULL,
	[dateModified] [datetime] NULL,
	[isActive] [bit] NULL,
	[isDeleted] [bit] NULL,
 CONSTRAINT [PK_tblTag] PRIMARY KEY CLUSTERED 
(
	[TagID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [Lookup].[tblTagType]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Lookup].[tblTagType](
	[TagTypeID] [int] NOT NULL,
	[title] [nvarchar](250) NULL,
	[description] [nvarchar](max) NULL,
	[dateCreated] [datetime] NULL,
	[dateModified] [datetime] NULL,
	[isActive] [bit] NULL,
	[isDeleted] [bit] NULL,
 CONSTRAINT [PK_tblTagType] PRIMARY KEY CLUSTERED 
(
	[TagTypeID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [Lookup].[tblTitle]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Lookup].[tblTitle](
	[titleID] [int] NOT NULL,
	[titleName] [nvarchar](150) NULL,
	[isActive] [bit] NULL,
	[isDeleted] [bit] NULL,
	[dateCreated] [datetime] NULL,
	[dateModified] [datetime] NULL,
 CONSTRAINT [PK_tblTitle] PRIMARY KEY CLUSTERED 
(
	[titleID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Lookup].[tblUserPaymentMethod]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Lookup].[tblUserPaymentMethod](
	[UserPaymentMethodID] [int] NOT NULL,
	[ProfileID] [int] NOT NULL,
	[PaymentMethodID] [int] NOT NULL,
	[dateCreated] [datetime] NULL,
	[dateModified] [datetime] NULL,
	[isActive] [bit] NULL,
	[isDeleted] [bit] NULL,
	[isDefault] [bit] NULL,
 CONSTRAINT [PK_tblUserPaymentMethod] PRIMARY KEY CLUSTERED 
(
	[UserPaymentMethodID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Product].[featureRequest]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Product].[featureRequest](
	[featureRequestID] [int] NOT NULL,
	[profileID] [int] NULL,
	[dateTo] [datetime] NULL,
	[dateFrom] [datetime] NULL,
	[requestStatusID] [int] NULL,
	[note] [nvarchar](max) NULL,
	[isActive] [bit] NULL,
	[isDeleted] [bit] NULL,
	[dateCreated] [datetime] NULL,
	[dateModified] [datetime] NULL,
	[payed] [bit] NULL,
	[amountPayed] [nvarchar](max) NULL,
 CONSTRAINT [PK_featureRequest] PRIMARY KEY CLUSTERED 
(
	[featureRequestID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [Product].[tblCategory]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Product].[tblCategory](
	[categoryID] [int] IDENTITY(1,1) NOT NULL,
	[name] [nvarchar](150) NULL,
	[description] [nvarchar](max) NULL,
	[isActive] [bit] NULL,
	[isDeleted] [bit] NULL,
	[dateModified] [datetime] NULL,
	[dateCreated] [datetime] NULL,
	[createdBy] [int] NULL,
	[modifiedBy] [int] NULL,
 CONSTRAINT [PK_tblCategory] PRIMARY KEY CLUSTERED 
(
	[categoryID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [Product].[tblDeal]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Product].[tblDeal](
	[dealID] [int] NOT NULL,
	[title] [nvarchar](250) NULL,
	[description] [nvarchar](max) NULL,
	[profileID] [int] NULL,
	[photo] [nvarchar](250) NULL,
	[serving] [int] NULL,
	[isActive] [bit] NULL,
	[isDeleted] [bit] NULL,
	[dateModified] [datetime] NULL,
	[dateCreated] [datetime] NULL,
	[price] [nvarchar](100) NULL,
	[isFeatured] [bit] NULL,
	[modifiedBy] [int] NULL,
 CONSTRAINT [PK_tblDeal] PRIMARY KEY CLUSTERED 
(
	[dealID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [Product].[tblDealItem]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Product].[tblDealItem](
	[itemID] [int] IDENTITY(1,1) NOT NULL,
	[dealID] [int] NULL,
	[mealID] [int] NULL,
	[isActive] [bit] NULL,
	[isDeleted] [bit] NULL,
	[dateModified] [datetime] NULL,
	[dateCreated] [datetime] NULL,
	[Quantity] [int] NULL,
 CONSTRAINT [PK_tblDealItem] PRIMARY KEY CLUSTERED 
(
	[itemID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Product].[tblGallery]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Product].[tblGallery](
	[galleryID] [int] NOT NULL,
	[galleryTypeID] [int] NULL,
	[sellerID] [int] NULL,
	[title] [nvarchar](500) NULL,
	[filename] [nvarchar](max) NULL,
	[isActive] [bit] NULL,
	[isDeleted] [bit] NULL,
	[dateModified] [datetime] NULL,
	[dateCreated] [datetime] NULL,
	[mealID] [int] NULL,
 CONSTRAINT [PK_tblGallery] PRIMARY KEY CLUSTERED 
(
	[galleryID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [Product].[tblMeal]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Product].[tblMeal](
	[mealID] [int] NOT NULL,
	[profileID] [int] NULL,
	[subCategoryID] [int] NULL,
	[categoryID] [int] NULL,
	[title] [nvarchar](250) NULL,
	[description] [nvarchar](500) NULL,
	[photo] [nvarchar](250) NULL,
	[serving] [int] NULL,
	[isSpeciality] [bit] NULL,
	[isFeature] [bit] NULL,
	[price] [nvarchar](150) NULL,
	[mealTypeID] [int] NULL,
	[isActive] [bit] NULL,
	[isDeleted] [bit] NULL,
	[dateModified] [datetime] NULL,
	[dateCreated] [datetime] NULL,
	[monday] [bit] NULL,
	[tuesday] [bit] NULL,
	[wednesday] [bit] NULL,
	[thursday] [bit] NULL,
	[friday] [bit] NULL,
	[saturday] [bit] NULL,
	[sunday] [bit] NULL,
	[modifiedBy] [int] NULL,
 CONSTRAINT [PK_tblMeal] PRIMARY KEY CLUSTERED 
(
	[mealID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Product].[tblMealTypes]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Product].[tblMealTypes](
	[mealTypeID] [int] NOT NULL,
	[mealID] [int] NULL,
	[typeID] [int] NULL,
	[isActive] [bit] NULL,
	[isDeleted] [bit] NULL,
	[dateModified] [datetime] NULL,
	[dateCreated] [datetime] NULL,
 CONSTRAINT [PK_tblMealTypes] PRIMARY KEY CLUSTERED 
(
	[mealTypeID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Product].[tblOrder]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Product].[tblOrder](
	[orderID] [int] NOT NULL,
	[sellerProfileID] [int] NULL,
	[buyerProfileID] [int] NULL,
	[deliveryDate] [datetime] NULL,
	[orderDate] [datetime] NULL,
	[deliveryAddress] [nvarchar](500) NULL,
	[quantity] [int] NULL,
	[ratingID] [int] NULL,
	[comment] [nvarchar](max) NULL,
	[isActive] [bit] NULL,
	[isDeleted] [bit] NULL,
	[dateModified] [datetime] NULL,
	[dateCreated] [datetime] NULL,
	[orderLastStatusID] [int] NULL,
	[lastStatusDate] [datetime] NULL,
	[recieptNumber] [nvarchar](max) NULL,
	[paymentDone] [bit] NULL,
	[price] [nvarchar](500) NULL,
	[PaymentMethodID] [int] NOT NULL,
	[PaymentTypeID] [int] NOT NULL,
 CONSTRAINT [PK_tblOrder] PRIMARY KEY CLUSTERED 
(
	[orderID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [Product].[tblOrderAddOns]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Product].[tblOrderAddOns](
	[orderAddOnID] [int] NOT NULL,
	[orderItemID] [int] NULL,
	[optionID] [int] NULL,
	[isDeleted] [bit] NULL,
	[isActive] [bit] NULL,
	[dateModified] [datetime] NULL,
	[dateCreated] [datetime] NULL,
 CONSTRAINT [PK_tblOrderAddOns] PRIMARY KEY CLUSTERED 
(
	[orderAddOnID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Product].[tblOrderItem]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Product].[tblOrderItem](
	[orderItemID] [int] NOT NULL,
	[orderID] [int] NULL,
	[mealID] [int] NULL,
	[dealID] [int] NULL,
	[quantity] [int] NULL,
	[comment] [nvarchar](500) NULL,
	[isActive] [bit] NULL,
	[isDeleted] [bit] NULL,
	[dateModified] [datetime] NULL,
	[dateCreated] [datetime] NULL,
 CONSTRAINT [PK_tblOrderItem] PRIMARY KEY CLUSTERED 
(
	[orderItemID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Product].[tblOrderStatus]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Product].[tblOrderStatus](
	[orderStatusID] [int] NOT NULL,
	[orderID] [int] NULL,
	[orderStatusTypeID] [int] NULL,
	[isActive] [bit] NULL,
	[isDeleted] [bit] NULL,
	[dateCreated] [datetime] NULL,
	[dateModified] [datetime] NULL,
 CONSTRAINT [PK_tblOrderStatus_1] PRIMARY KEY CLUSTERED 
(
	[orderStatusID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Product].[tblPayment]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Product].[tblPayment](
	[paymentID] [int] NOT NULL,
	[orderID] [int] NULL,
	[sellerID] [int] NULL,
	[countryID] [int] NULL,
	[totalAmount] [nvarchar](500) NULL,
	[transactionDate] [datetime] NULL,
	[dateModified] [datetime] NULL,
	[isDeleted] [bit] NULL,
	[isActive] [bit] NULL,
	[DateCreated] [datetime] NULL,
	[paymentStatusID] [int] NULL,
	[grossAmount] [nvarchar](500) NULL,
	[netAmount] [nvarchar](500) NULL,
	[taxAmount] [nvarchar](500) NULL,
	[commisionAmount] [nvarchar](500) NULL,
	[otherAmount] [nvarchar](500) NULL,
 CONSTRAINT [PK_tblPayment] PRIMARY KEY CLUSTERED 
(
	[paymentID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Product].[tblSubCategory]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Product].[tblSubCategory](
	[subCategoryID] [int] IDENTITY(1,1) NOT NULL,
	[CategoryID] [int] NOT NULL,
	[name] [nvarchar](150) NULL,
	[description] [nvarchar](max) NULL,
	[isActive] [bit] NULL,
	[isDeleted] [bit] NULL,
	[dateModified] [datetime] NULL,
	[dateCreated] [datetime] NULL,
	[createdBy] [int] NULL,
	[modifiedBy] [int] NULL,
 CONSTRAINT [PK_tblSubCategory] PRIMARY KEY CLUSTERED 
(
	[subCategoryID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [Profile].[tblAttachment]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Profile].[tblAttachment](
	[attachmentID] [int] IDENTITY(1,1) NOT NULL,
	[folderTypeID] [int] NULL,
	[folder] [nvarchar](500) NULL,
	[documentTitle] [nvarchar](500) NULL,
	[ext] [nvarchar](50) NULL,
	[profileID] [int] NULL,
	[isActive] [bit] NULL,
	[isDeleted] [bit] NULL,
	[dateModified] [datetime] NULL,
	[dateCreated] [datetime] NULL,
	[name] [nvarchar](500) NULL,
 CONSTRAINT [PK_tblAttachment] PRIMARY KEY CLUSTERED 
(
	[attachmentID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Profile].[tblOffer]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Profile].[tblOffer](
	[OfferID] [int] NOT NULL,
	[OfferTypeID] [int] NOT NULL,
	[SellerID] [int] NOT NULL,
	[StartDate] [int] NOT NULL,
	[EndDate] [int] NOT NULL,
	[IsCoupin] [int] NOT NULL,
	[Duration] [int] NULL,
	[title] [nvarchar](250) NULL,
	[description] [nvarchar](max) NULL,
	[dateCreated] [datetime] NULL,
	[dateModified] [datetime] NULL,
	[isActive] [bit] NULL,
	[isDeleted] [bit] NULL,
 CONSTRAINT [PK_tblOffer] PRIMARY KEY CLUSTERED 
(
	[OfferID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [Profile].[tblOfferItem]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Profile].[tblOfferItem](
	[OfferItemID] [int] NOT NULL,
	[OfferID] [int] NOT NULL,
	[MealID] [int] NOT NULL,
	[StartDate] [int] NOT NULL,
	[EndDate] [int] NOT NULL,
	[DiscountPrice] [decimal](18, 0) NULL,
	[Duration] [int] NULL,
	[title] [nvarchar](250) NULL,
	[description] [nvarchar](max) NULL,
	[dateCreated] [datetime] NULL,
	[dateModified] [datetime] NULL,
	[isActive] [bit] NULL,
	[isDeleted] [bit] NULL,
 CONSTRAINT [PK_tblOfferItem] PRIMARY KEY CLUSTERED 
(
	[OfferItemID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [Profile].[tblSeller]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Profile].[tblSeller](
	[sellerID] [int] NOT NULL,
	[profileID] [int] NULL,
	[NICNumber] [nvarchar](250) NULL,
	[nationality] [nvarchar](150) NULL,
	[religion] [nvarchar](150) NULL,
	[age] [int] NULL,
	[isFeatured] [bit] NULL,
	[isTopSeller] [bit] NULL,
	[bannarPhoto] [nvarchar](250) NULL,
	[workPhone] [nvarchar](150) NULL,
	[deliveryRange] [nvarchar](50) NULL,
	[registrationStatusID] [int] NULL,
	[offerDelivery] [bit] NULL,
	[isActive] [bit] NULL,
	[isDeleted] [bit] NULL,
	[dateModified] [datetime] NULL,
	[dateCreated] [datetime] NULL,
	[displayTitle] [nvarchar](500) NULL,
	[description] [nvarchar](max) NULL,
	[recordModified] [bit] NULL,
	[modificationVerified] [bit] NULL,
	[modifiedBy] [int] NULL,
	[FolderID] [nvarchar](max) NULL,
	[accountTitle] [nvarchar](500) NULL,
	[accountNumber] [nvarchar](500) NULL,
	[bankName] [nvarchar](500) NULL,
	[logo] [nvarchar](max) NULL,
	[avgRating] [int] NULL,
	[ratedCount] [int] NULL,
	[totalRating] [int] NULL,
 CONSTRAINT [PK_tblSeller] PRIMARY KEY CLUSTERED 
(
	[sellerID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [Profile].[tblSellerPayment]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Profile].[tblSellerPayment](
	[SellerPaymentID] [int] NOT NULL,
	[SellerID] [int] NOT NULL,
	[OrderID] [int] NOT NULL,
	[ActualAmount] [int] NOT NULL,
	[CompanyPercentage] [int] NOT NULL,
	[DepositAmount] [int] NOT NULL,
	[FinalAmount] [nvarchar](250) NULL,
	[Note] [nvarchar](max) NULL,
	[dateCreated] [datetime] NULL,
	[dateModified] [datetime] NULL,
	[isActive] [bit] NULL,
	[isDeleted] [bit] NULL,
 CONSTRAINT [PK_tblSellerPayment] PRIMARY KEY CLUSTERED 
(
	[SellerPaymentID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [Profile].[tblSellerRegistrationStatus]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Profile].[tblSellerRegistrationStatus](
	[sellerRegistrationID] [int] IDENTITY(1,1) NOT NULL,
	[sellerID] [int] NULL,
	[registrationStatusID] [int] NULL,
	[statusDate] [datetime] NULL,
	[isActive] [bit] NULL,
	[isDeleted] [bit] NULL,
	[dateModified] [datetime] NULL,
	[dateCreated] [datetime] NULL,
	[modifiedBy] [int] NULL,
 CONSTRAINT [PK_sellerRegistrationStatus] PRIMARY KEY CLUSTERED 
(
	[sellerRegistrationID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Profile].[tblUser]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Profile].[tblUser](
	[profileID] [int] NOT NULL,
	[username] [nvarchar](250) NULL,
	[password] [nvarchar](250) NULL,
	[firstName] [nvarchar](500) NULL,
	[middleName] [nvarchar](500) NULL,
	[lastName] [nvarchar](500) NULL,
	[mobile] [nvarchar](100) NULL,
	[phoneNumber] [nvarchar](100) NULL,
	[titleID] [int] NULL,
	[genderID] [int] NULL,
	[maritalStatusID] [int] NULL,
	[DOB] [datetime] NULL,
	[profilePhoto] [nvarchar](500) NULL,
	[isActive] [bit] NULL,
	[isDeleted] [bit] NULL,
	[dateModified] [datetime] NULL,
	[dateCreated] [datetime] NULL,
	[email] [nvarchar](500) NULL,
	[modifiedBy] [int] NULL,
	[isFacebook] [bit] NULL,
	[isGoogle] [bit] NULL,
	[token] [nvarchar](500) NULL,
	[countryID] [int] NULL,
 CONSTRAINT [PK_tblUser] PRIMARY KEY CLUSTERED 
(
	[profileID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Profile].[tblUserAddress]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Profile].[tblUserAddress](
	[addressID] [int] NOT NULL,
	[addressTypeID] [int] NULL,
	[profileID] [int] NULL,
	[countryID] [int] NULL,
	[cityID] [int] NULL,
	[postalCode] [nvarchar](150) NULL,
	[address] [nvarchar](500) NULL,
	[isActive] [bit] NULL,
	[isDeleted] [bit] NULL,
	[dateModified] [datetime] NULL,
	[dateCreated] [datetime] NULL,
 CONSTRAINT [PK_tblUserAddress] PRIMARY KEY CLUSTERED 
(
	[addressID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Profile].[tblUserDiscount]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Profile].[tblUserDiscount](
	[UserDiscountID] [int] NOT NULL,
	[ProfileID] [int] NOT NULL,
	[DiscountID] [int] NOT NULL,
	[ExpiryDate] [datetime] NOT NULL,
	[dateCreated] [datetime] NULL,
	[dateModified] [datetime] NULL,
	[isActive] [bit] NULL,
	[isDeleted] [bit] NULL,
 CONSTRAINT [PK_tblUserDiscount] PRIMARY KEY CLUSTERED 
(
	[UserDiscountID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Profile].[tblUserFavourites]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Profile].[tblUserFavourites](
	[userfavouriteID] [int] NOT NULL,
	[sellerProfileID] [int] NULL,
	[buyerProfileID] [int] NULL,
	[isActive] [bit] NULL,
	[isDeleted] [bit] NULL,
	[dateModified] [datetime] NULL,
	[dateCreated] [datetime] NULL,
 CONSTRAINT [PK_tblUserFavourites] PRIMARY KEY CLUSTERED 
(
	[userfavouriteID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Profile].[tblUserOffer]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Profile].[tblUserOffer](
	[UserOfferID] [int] NOT NULL,
	[ProfileID] [int] NOT NULL,
	[OfferID] [int] NOT NULL,
	[ExpiryDate] [datetime] NOT NULL,
	[dateCreated] [datetime] NULL,
	[dateModified] [datetime] NULL,
	[isActive] [bit] NULL,
	[isDeleted] [bit] NULL,
 CONSTRAINT [PK_tblUserOffer] PRIMARY KEY CLUSTERED 
(
	[UserOfferID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Profile].[tblUserPaymentMethod]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Profile].[tblUserPaymentMethod](
	[UserPaymentMethodID] [int] NOT NULL,
	[ProfileID] [int] NOT NULL,
	[PaymentMethodID] [int] NOT NULL,
	[dateCreated] [datetime] NULL,
	[dateModified] [datetime] NULL,
	[isActive] [bit] NULL,
	[isDeleted] [bit] NULL,
	[isDefault] [bit] NULL,
 CONSTRAINT [PK_tblUserPaymentMethod] PRIMARY KEY CLUSTERED 
(
	[UserPaymentMethodID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Profile].[tblUserRole]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Profile].[tblUserRole](
	[userRoleID] [int] NOT NULL,
	[profileID] [int] NULL,
	[roleID] [int] NULL,
	[isActive] [bit] NULL,
	[isDeleted] [bit] NULL,
	[dateModified] [datetime] NULL,
	[dateCreated] [datetime] NULL,
 CONSTRAINT [PK_tblUserRole] PRIMARY KEY CLUSTERED 
(
	[userRoleID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Profile].[tblUserTag]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Profile].[tblUserTag](
	[UserTagID] [int] NOT NULL,
	[AssignedToID] [int] NOT NULL,
	[TagID] [int] NOT NULL,
	[AssignedByID] [int] NOT NULL,
	[dateCreated] [datetime] NULL,
	[dateModified] [datetime] NULL,
	[isActive] [bit] NULL,
	[isDeleted] [bit] NULL,
 CONSTRAINT [PK_tblUserTag] PRIMARY KEY CLUSTERED 
(
	[UserTagID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [Lookup].[tblRole] ADD  CONSTRAINT [DF_Lookup.tblRole_isActive]  DEFAULT ((1)) FOR [isActive]
GO
ALTER TABLE [Product].[tblOrder] ADD  DEFAULT ((0)) FOR [PaymentMethodID]
GO
ALTER TABLE [Product].[tblOrder] ADD  DEFAULT ((0)) FOR [PaymentTypeID]
GO
ALTER TABLE [dbo].[tblContactUs]  WITH CHECK ADD  CONSTRAINT [FK_tblContactUs_tblContactUsStatus] FOREIGN KEY([queryStatusID])
REFERENCES [Lookup].[tblContactUsStatus] ([queryStatusID])
GO
ALTER TABLE [dbo].[tblContactUs] CHECK CONSTRAINT [FK_tblContactUs_tblContactUsStatus]
GO
ALTER TABLE [dbo].[tblContactUs]  WITH CHECK ADD  CONSTRAINT [FK_tblContactUs_tblContactUsType] FOREIGN KEY([queryTypeID])
REFERENCES [Lookup].[tblContactUsType] ([queryTypeID])
GO
ALTER TABLE [dbo].[tblContactUs] CHECK CONSTRAINT [FK_tblContactUs_tblContactUsType]
GO
ALTER TABLE [dbo].[tblLogforgotPassword]  WITH CHECK ADD  CONSTRAINT [FK_tblLogforgotPassword_tblUser] FOREIGN KEY([profileID])
REFERENCES [Profile].[tblUser] ([profileID])
GO
ALTER TABLE [dbo].[tblLogforgotPassword] CHECK CONSTRAINT [FK_tblLogforgotPassword_tblUser]
GO
ALTER TABLE [dbo].[tblLogLogin]  WITH CHECK ADD  CONSTRAINT [FK_tblLogLogin_tblUser] FOREIGN KEY([profileID])
REFERENCES [Profile].[tblUser] ([profileID])
GO
ALTER TABLE [dbo].[tblLogLogin] CHECK CONSTRAINT [FK_tblLogLogin_tblUser]
GO
ALTER TABLE [dbo].[tblLogTimeline]  WITH CHECK ADD  CONSTRAINT [FK_tblLogTimeline_tblUser] FOREIGN KEY([profileID])
REFERENCES [Profile].[tblUser] ([profileID])
GO
ALTER TABLE [dbo].[tblLogTimeline] CHECK CONSTRAINT [FK_tblLogTimeline_tblUser]
GO
ALTER TABLE [dbo].[tblNotification]  WITH CHECK ADD  CONSTRAINT [FK_tblNotification_tblNotificationType] FOREIGN KEY([notificationType])
REFERENCES [Lookup].[tblNotificationType] ([notificationTypeID])
GO
ALTER TABLE [dbo].[tblNotification] CHECK CONSTRAINT [FK_tblNotification_tblNotificationType]
GO
ALTER TABLE [Lookup].[tblCity]  WITH CHECK ADD  CONSTRAINT [FK_tblCity_tblCountry] FOREIGN KEY([countryID])
REFERENCES [Lookup].[tblCountry] ([countryID])
GO
ALTER TABLE [Lookup].[tblCity] CHECK CONSTRAINT [FK_tblCity_tblCountry]
GO
ALTER TABLE [Lookup].[tblDiscount]  WITH CHECK ADD  CONSTRAINT [FK_tblDiscount_tblDiscountType] FOREIGN KEY([DiscountTypeID])
REFERENCES [Lookup].[tblDiscountType] ([DiscountTypeID])
GO
ALTER TABLE [Lookup].[tblDiscount] CHECK CONSTRAINT [FK_tblDiscount_tblDiscountType]
GO
ALTER TABLE [Lookup].[tblPaymentMethodCountry]  WITH CHECK ADD  CONSTRAINT [FK_tblPaymentMethodCountry_tblCountry] FOREIGN KEY([CountryID])
REFERENCES [Lookup].[tblCountry] ([countryID])
GO
ALTER TABLE [Lookup].[tblPaymentMethodCountry] CHECK CONSTRAINT [FK_tblPaymentMethodCountry_tblCountry]
GO
ALTER TABLE [Lookup].[tblPaymentMethodCountry]  WITH CHECK ADD  CONSTRAINT [FK_tblPaymentMethodCountry_tblPaymentMethod] FOREIGN KEY([PaymentMethodID])
REFERENCES [Lookup].[tblPaymentMethod] ([PaymentMethodID])
GO
ALTER TABLE [Lookup].[tblPaymentMethodCountry] CHECK CONSTRAINT [FK_tblPaymentMethodCountry_tblPaymentMethod]
GO
ALTER TABLE [Lookup].[tblSellerPaymentSetting]  WITH CHECK ADD  CONSTRAINT [FK_SellerPaymentSetting_tblUser] FOREIGN KEY([SellerID])
REFERENCES [Profile].[tblUser] ([profileID])
GO
ALTER TABLE [Lookup].[tblSellerPaymentSetting] CHECK CONSTRAINT [FK_SellerPaymentSetting_tblUser]
GO
ALTER TABLE [Lookup].[tblTag]  WITH CHECK ADD  CONSTRAINT [FK_tblTag_tblMeal] FOREIGN KEY([MealID])
REFERENCES [Product].[tblMeal] ([mealID])
GO
ALTER TABLE [Lookup].[tblTag] CHECK CONSTRAINT [FK_tblTag_tblMeal]
GO
ALTER TABLE [Lookup].[tblTag]  WITH CHECK ADD  CONSTRAINT [FK_tblTag_tblTagType] FOREIGN KEY([TagTypeID])
REFERENCES [Lookup].[tblTagType] ([TagTypeID])
GO
ALTER TABLE [Lookup].[tblTag] CHECK CONSTRAINT [FK_tblTag_tblTagType]
GO
ALTER TABLE [Lookup].[tblUserPaymentMethod]  WITH CHECK ADD  CONSTRAINT [FK_tblUserPaymentMethod_tblPaymentMethod] FOREIGN KEY([PaymentMethodID])
REFERENCES [Lookup].[tblPaymentMethod] ([PaymentMethodID])
GO
ALTER TABLE [Lookup].[tblUserPaymentMethod] CHECK CONSTRAINT [FK_tblUserPaymentMethod_tblPaymentMethod]
GO
ALTER TABLE [Lookup].[tblUserPaymentMethod]  WITH CHECK ADD  CONSTRAINT [FK_tblUserPaymentMethod_tblUser] FOREIGN KEY([ProfileID])
REFERENCES [Profile].[tblUser] ([profileID])
GO
ALTER TABLE [Lookup].[tblUserPaymentMethod] CHECK CONSTRAINT [FK_tblUserPaymentMethod_tblUser]
GO
ALTER TABLE [Product].[tblDealItem]  WITH CHECK ADD  CONSTRAINT [FK_tblDealItem_tblDeal] FOREIGN KEY([dealID])
REFERENCES [Product].[tblDeal] ([dealID])
GO
ALTER TABLE [Product].[tblDealItem] CHECK CONSTRAINT [FK_tblDealItem_tblDeal]
GO
ALTER TABLE [Product].[tblDealItem]  WITH CHECK ADD  CONSTRAINT [FK_tblDealItem_tblMeal] FOREIGN KEY([mealID])
REFERENCES [Product].[tblMeal] ([mealID])
GO
ALTER TABLE [Product].[tblDealItem] CHECK CONSTRAINT [FK_tblDealItem_tblMeal]
GO
ALTER TABLE [Product].[tblMeal]  WITH CHECK ADD  CONSTRAINT [FK_tblMeal_tblCategory] FOREIGN KEY([categoryID])
REFERENCES [Product].[tblCategory] ([categoryID])
GO
ALTER TABLE [Product].[tblMeal] CHECK CONSTRAINT [FK_tblMeal_tblCategory]
GO
ALTER TABLE [Product].[tblMeal]  WITH CHECK ADD  CONSTRAINT [FK_tblMeal_tblMealType] FOREIGN KEY([mealTypeID])
REFERENCES [Lookup].[tblMealType] ([mealTypeID])
GO
ALTER TABLE [Product].[tblMeal] CHECK CONSTRAINT [FK_tblMeal_tblMealType]
GO
ALTER TABLE [Product].[tblMeal]  WITH CHECK ADD  CONSTRAINT [FK_tblMeal_tblSubCategory] FOREIGN KEY([subCategoryID])
REFERENCES [Product].[tblSubCategory] ([subCategoryID])
GO
ALTER TABLE [Product].[tblMeal] CHECK CONSTRAINT [FK_tblMeal_tblSubCategory]
GO
ALTER TABLE [Product].[tblOrder]  WITH CHECK ADD  CONSTRAINT [FK_tblOrder_tblOrderStatus] FOREIGN KEY([orderLastStatusID])
REFERENCES [Lookup].[tblOrderStatus] ([orderStatusID])
GO
ALTER TABLE [Product].[tblOrder] CHECK CONSTRAINT [FK_tblOrder_tblOrderStatus]
GO
ALTER TABLE [Product].[tblOrder]  WITH CHECK ADD  CONSTRAINT [FK_tblOrder_tblRating] FOREIGN KEY([ratingID])
REFERENCES [Lookup].[tblRating] ([ratingID])
GO
ALTER TABLE [Product].[tblOrder] CHECK CONSTRAINT [FK_tblOrder_tblRating]
GO
ALTER TABLE [Product].[tblOrderItem]  WITH CHECK ADD  CONSTRAINT [FK_tblOrderItem_tblDeal] FOREIGN KEY([dealID])
REFERENCES [Product].[tblDeal] ([dealID])
GO
ALTER TABLE [Product].[tblOrderItem] CHECK CONSTRAINT [FK_tblOrderItem_tblDeal]
GO
ALTER TABLE [Product].[tblOrderItem]  WITH CHECK ADD  CONSTRAINT [FK_tblOrderItem_tblMeal] FOREIGN KEY([mealID])
REFERENCES [Product].[tblMeal] ([mealID])
GO
ALTER TABLE [Product].[tblOrderItem] CHECK CONSTRAINT [FK_tblOrderItem_tblMeal]
GO
ALTER TABLE [Product].[tblOrderItem]  WITH CHECK ADD  CONSTRAINT [FK_tblOrderItem_tblOrder] FOREIGN KEY([orderID])
REFERENCES [Product].[tblOrder] ([orderID])
GO
ALTER TABLE [Product].[tblOrderItem] CHECK CONSTRAINT [FK_tblOrderItem_tblOrder]
GO
ALTER TABLE [Product].[tblOrderStatus]  WITH CHECK ADD  CONSTRAINT [FK_tblOrderStatus_tblOrder] FOREIGN KEY([orderID])
REFERENCES [Product].[tblOrder] ([orderID])
GO
ALTER TABLE [Product].[tblOrderStatus] CHECK CONSTRAINT [FK_tblOrderStatus_tblOrder]
GO
ALTER TABLE [Product].[tblOrderStatus]  WITH CHECK ADD  CONSTRAINT [FK_tblOrderStatus_tblOrderStatus] FOREIGN KEY([orderStatusTypeID])
REFERENCES [Lookup].[tblOrderStatus] ([orderStatusID])
GO
ALTER TABLE [Product].[tblOrderStatus] CHECK CONSTRAINT [FK_tblOrderStatus_tblOrderStatus]
GO
ALTER TABLE [Profile].[tblAttachment]  WITH CHECK ADD  CONSTRAINT [FK_tblAttachment_tblUser] FOREIGN KEY([profileID])
REFERENCES [Profile].[tblUser] ([profileID])
GO
ALTER TABLE [Profile].[tblAttachment] CHECK CONSTRAINT [FK_tblAttachment_tblUser]
GO
ALTER TABLE [Profile].[tblOffer]  WITH CHECK ADD  CONSTRAINT [FK_tblOffer_tblOfferType] FOREIGN KEY([OfferTypeID])
REFERENCES [Lookup].[tblOfferType] ([OfferTypeID])
GO
ALTER TABLE [Profile].[tblOffer] CHECK CONSTRAINT [FK_tblOffer_tblOfferType]
GO
ALTER TABLE [Profile].[tblOfferItem]  WITH CHECK ADD  CONSTRAINT [FK_tblOfferItem_tblMeal] FOREIGN KEY([MealID])
REFERENCES [Product].[tblMeal] ([mealID])
GO
ALTER TABLE [Profile].[tblOfferItem] CHECK CONSTRAINT [FK_tblOfferItem_tblMeal]
GO
ALTER TABLE [Profile].[tblOfferItem]  WITH CHECK ADD  CONSTRAINT [FK_tblOfferItem_tblOffer] FOREIGN KEY([OfferID])
REFERENCES [Profile].[tblOffer] ([OfferID])
GO
ALTER TABLE [Profile].[tblOfferItem] CHECK CONSTRAINT [FK_tblOfferItem_tblOffer]
GO
ALTER TABLE [Profile].[tblSeller]  WITH CHECK ADD  CONSTRAINT [FK_tblSeller_tblUser] FOREIGN KEY([profileID])
REFERENCES [Profile].[tblUser] ([profileID])
GO
ALTER TABLE [Profile].[tblSeller] CHECK CONSTRAINT [FK_tblSeller_tblUser]
GO
ALTER TABLE [Profile].[tblSellerPayment]  WITH CHECK ADD  CONSTRAINT [FK_SellerPayment_tblOrder] FOREIGN KEY([OrderID])
REFERENCES [Product].[tblOrder] ([orderID])
GO
ALTER TABLE [Profile].[tblSellerPayment] CHECK CONSTRAINT [FK_SellerPayment_tblOrder]
GO
ALTER TABLE [Profile].[tblSellerPayment]  WITH CHECK ADD  CONSTRAINT [FK_SellerPayment_tblUser] FOREIGN KEY([SellerID])
REFERENCES [Profile].[tblUser] ([profileID])
GO
ALTER TABLE [Profile].[tblSellerPayment] CHECK CONSTRAINT [FK_SellerPayment_tblUser]
GO
ALTER TABLE [Profile].[tblSellerRegistrationStatus]  WITH CHECK ADD  CONSTRAINT [FK_tblSellerRegistrationStatus_tblRegisterationStatus] FOREIGN KEY([registrationStatusID])
REFERENCES [Lookup].[tblRegisterationStatus] ([registrationStatusID])
GO
ALTER TABLE [Profile].[tblSellerRegistrationStatus] CHECK CONSTRAINT [FK_tblSellerRegistrationStatus_tblRegisterationStatus]
GO
ALTER TABLE [Profile].[tblSellerRegistrationStatus]  WITH CHECK ADD  CONSTRAINT [FK_tblSellerRegistrationStatus_tblSeller] FOREIGN KEY([sellerID])
REFERENCES [Profile].[tblSeller] ([sellerID])
GO
ALTER TABLE [Profile].[tblSellerRegistrationStatus] CHECK CONSTRAINT [FK_tblSellerRegistrationStatus_tblSeller]
GO
ALTER TABLE [Profile].[tblUser]  WITH CHECK ADD  CONSTRAINT [FK_tblUser_tblGender] FOREIGN KEY([genderID])
REFERENCES [Lookup].[tblGender] ([genderID])
GO
ALTER TABLE [Profile].[tblUser] CHECK CONSTRAINT [FK_tblUser_tblGender]
GO
ALTER TABLE [Profile].[tblUser]  WITH CHECK ADD  CONSTRAINT [FK_tblUser_tblMaritalStatus] FOREIGN KEY([maritalStatusID])
REFERENCES [Lookup].[tblMaritalStatus] ([maritalStatusID])
GO
ALTER TABLE [Profile].[tblUser] CHECK CONSTRAINT [FK_tblUser_tblMaritalStatus]
GO
ALTER TABLE [Profile].[tblUser]  WITH CHECK ADD  CONSTRAINT [FK_tblUser_tblTitle] FOREIGN KEY([titleID])
REFERENCES [Lookup].[tblTitle] ([titleID])
GO
ALTER TABLE [Profile].[tblUser] CHECK CONSTRAINT [FK_tblUser_tblTitle]
GO
ALTER TABLE [Profile].[tblUserAddress]  WITH CHECK ADD  CONSTRAINT [FK_tblUserAddress_tblAddressType] FOREIGN KEY([addressTypeID])
REFERENCES [Lookup].[tblAddressType] ([addressTypeID])
GO
ALTER TABLE [Profile].[tblUserAddress] CHECK CONSTRAINT [FK_tblUserAddress_tblAddressType]
GO
ALTER TABLE [Profile].[tblUserAddress]  WITH CHECK ADD  CONSTRAINT [FK_tblUserAddress_tblCity] FOREIGN KEY([cityID])
REFERENCES [Lookup].[tblCity] ([cityID])
GO
ALTER TABLE [Profile].[tblUserAddress] CHECK CONSTRAINT [FK_tblUserAddress_tblCity]
GO
ALTER TABLE [Profile].[tblUserAddress]  WITH CHECK ADD  CONSTRAINT [FK_tblUserAddress_tblCountry] FOREIGN KEY([countryID])
REFERENCES [Lookup].[tblCountry] ([countryID])
GO
ALTER TABLE [Profile].[tblUserAddress] CHECK CONSTRAINT [FK_tblUserAddress_tblCountry]
GO
ALTER TABLE [Profile].[tblUserAddress]  WITH CHECK ADD  CONSTRAINT [FK_tblUserAddress_tblUser] FOREIGN KEY([profileID])
REFERENCES [Profile].[tblUser] ([profileID])
GO
ALTER TABLE [Profile].[tblUserAddress] CHECK CONSTRAINT [FK_tblUserAddress_tblUser]
GO
ALTER TABLE [Profile].[tblUserDiscount]  WITH CHECK ADD  CONSTRAINT [FK_tblUserDiscount_tblDiscount] FOREIGN KEY([DiscountID])
REFERENCES [Lookup].[tblDiscount] ([DiscountID])
GO
ALTER TABLE [Profile].[tblUserDiscount] CHECK CONSTRAINT [FK_tblUserDiscount_tblDiscount]
GO
ALTER TABLE [Profile].[tblUserDiscount]  WITH CHECK ADD  CONSTRAINT [FK_tblUserDiscount_tblUser] FOREIGN KEY([ProfileID])
REFERENCES [Profile].[tblUser] ([profileID])
GO
ALTER TABLE [Profile].[tblUserDiscount] CHECK CONSTRAINT [FK_tblUserDiscount_tblUser]
GO
ALTER TABLE [Profile].[tblUserFavourites]  WITH CHECK ADD  CONSTRAINT [FK_tblUserFavourites_tblUser] FOREIGN KEY([buyerProfileID])
REFERENCES [Profile].[tblUser] ([profileID])
GO
ALTER TABLE [Profile].[tblUserFavourites] CHECK CONSTRAINT [FK_tblUserFavourites_tblUser]
GO
ALTER TABLE [Profile].[tblUserFavourites]  WITH CHECK ADD  CONSTRAINT [FK_tblUserFavourites_tblUser1] FOREIGN KEY([sellerProfileID])
REFERENCES [Profile].[tblUser] ([profileID])
GO
ALTER TABLE [Profile].[tblUserFavourites] CHECK CONSTRAINT [FK_tblUserFavourites_tblUser1]
GO
ALTER TABLE [Profile].[tblUserOffer]  WITH CHECK ADD  CONSTRAINT [FK_tblUserOffer_tblUser] FOREIGN KEY([ProfileID])
REFERENCES [Profile].[tblUser] ([profileID])
GO
ALTER TABLE [Profile].[tblUserOffer] CHECK CONSTRAINT [FK_tblUserOffer_tblUser]
GO
ALTER TABLE [Profile].[tblUserPaymentMethod]  WITH CHECK ADD  CONSTRAINT [FK_tblUserPaymentMethod_tblPaymentMethod] FOREIGN KEY([PaymentMethodID])
REFERENCES [Lookup].[tblPaymentMethod] ([PaymentMethodID])
GO
ALTER TABLE [Profile].[tblUserPaymentMethod] CHECK CONSTRAINT [FK_tblUserPaymentMethod_tblPaymentMethod]
GO
ALTER TABLE [Profile].[tblUserPaymentMethod]  WITH CHECK ADD  CONSTRAINT [FK_tblUserPaymentMethod_tblUser] FOREIGN KEY([ProfileID])
REFERENCES [Profile].[tblUser] ([profileID])
GO
ALTER TABLE [Profile].[tblUserPaymentMethod] CHECK CONSTRAINT [FK_tblUserPaymentMethod_tblUser]
GO
ALTER TABLE [Profile].[tblUserRole]  WITH CHECK ADD  CONSTRAINT [FK_tblUserRole_tblRole] FOREIGN KEY([roleID])
REFERENCES [Lookup].[tblRole] ([roleID])
GO
ALTER TABLE [Profile].[tblUserRole] CHECK CONSTRAINT [FK_tblUserRole_tblRole]
GO
ALTER TABLE [Profile].[tblUserRole]  WITH CHECK ADD  CONSTRAINT [FK_tblUserRole_tblUser] FOREIGN KEY([profileID])
REFERENCES [Profile].[tblUser] ([profileID])
GO
ALTER TABLE [Profile].[tblUserRole] CHECK CONSTRAINT [FK_tblUserRole_tblUser]
GO
ALTER TABLE [Profile].[tblUserTag]  WITH CHECK ADD  CONSTRAINT [FK_tblUserDiscount_tblTag] FOREIGN KEY([TagID])
REFERENCES [Lookup].[tblTag] ([TagID])
GO
ALTER TABLE [Profile].[tblUserTag] CHECK CONSTRAINT [FK_tblUserDiscount_tblTag]
GO
ALTER TABLE [Profile].[tblUserTag]  WITH CHECK ADD  CONSTRAINT [FK_tblUserTag_tblTag] FOREIGN KEY([TagID])
REFERENCES [Lookup].[tblTag] ([TagID])
GO
ALTER TABLE [Profile].[tblUserTag] CHECK CONSTRAINT [FK_tblUserTag_tblTag]
GO
ALTER TABLE [Profile].[tblUserTag]  WITH CHECK ADD  CONSTRAINT [FK_tblUserTag_tblUser] FOREIGN KEY([AssignedToID])
REFERENCES [Profile].[tblUser] ([profileID])
GO
ALTER TABLE [Profile].[tblUserTag] CHECK CONSTRAINT [FK_tblUserTag_tblUser]
GO
ALTER TABLE [Profile].[tblUserTag]  WITH CHECK ADD  CONSTRAINT [FK_tblUserTag_tblUser2] FOREIGN KEY([AssignedByID])
REFERENCES [Profile].[tblUser] ([profileID])
GO
ALTER TABLE [Profile].[tblUserTag] CHECK CONSTRAINT [FK_tblUserTag_tblUser2]
GO
/****** Object:  StoredProcedure [dbo].[usInsertContactUsQuery]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 20/03/2018
-- Description: 
-- Exec [dbo].[usInsertContactUsReply]  

-- =============================================
CREATE PROCEDURE [dbo].[usInsertContactUsQuery] 
    @pQuery	nvarchar(max)	 
   ,@pEmail nvarchar(500)
   ,@pPhone nvarchar(500) =null
   ,@pName nvarchar(500)

AS
BEGIN
    DECLARE	@vName nvarchar(max),
			@vAdminName nvarchar(max)
		
	BEGIN TRY

		INSERT INTO [dbo].[tblContactUs]
           ([contactUsID]
           ,[email]
           ,[query]
           ,[queryTypeID]
           ,[queryStatusID]
           ,[isActive]
           ,[isDeleted]
           ,[dateModified]
           ,[dateCreated]
           ,[profileID]
           ,[isSeller]
           ,[isBuyer]
           ,[phone]
           ,[name])
     VALUES
           (
			Next Value for [dbo].[Seq_tblContactUs] 
           ,@pEmail
           ,@pQuery
           ,2
           ,1
           ,1
           ,0
           ,GETDATE()
           ,GETDATE()
           ,0
           ,0
           ,0
           ,@pPhone
           ,@pName)

		 Insert into tblLogTimeline
				(profileID,dateCreated,dateModified,isActive,isDeleted,description)
				 Values ( '',GETDATE(),GETDATE(),1,0,@pEmail+' send a query.')

	
	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [dbo].[usInsertContactUsReply]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 20/03/2018
-- Description: 
-- Exec [dbo].[usInsertContactUsReply]  

-- =============================================
CREATE PROCEDURE [dbo].[usInsertContactUsReply] 
    @pProfileID	int	 
   ,@pStatusID int
   ,@pContactUsID nvarchar(500)
   ,@pEmail nvarchar(500)
   ,@pUserID nvarchar(500)
   ,@pReply nvarchar(500) =null

AS
BEGIN
    DECLARE	@vName nvarchar(max),
			@vAdminName nvarchar(max)
		
	BEGIN TRY

    IF ISNULL(@pProfileID,0) > 0
	BEGIN
	    SELECT @vName=username from  [Profile].[tblUser] where profileID=@pProfileID
		SELECT @vAdminName=firstName +' '+lastName from  [Profile].[tblUser] where profileID=@pProfileID


		UPDATE [dbo].[tblContactUs]
	    SET
		   queryStatusID=4
		  ,[dateModified] = GETDATE()
		  ,reply=@pReply
		  ,[modifiedBy] = @pProfileID
	    WHERE contactUsID in (select SplitResult from Function_Split(@pContactUsID , ','))


		
		 Insert into tblLogTimeline
				(profileID,dateCreated,dateModified,isActive,isDeleted,description)
				 Values (@pProfileID,GETDATE(),GETDATE(),1,0,@vAdminName+' send reply for the query asked by  <b> '+ @pEmail +'</b> email.')
	END

	--IF ISNULL(@pUserID,0) > 0
	--BEGIN
	--   	 Insert into tblLogTimeline
	--			(profileID,dateCreated,dateModified,isActive,isDeleted,description)
	--			 Values (@pUserID,GETDATE(),GETDATE(),1,0,'Your query status has been answered.')
	--END
	
	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [dbo].[uspChangeContactUsStatus]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 20/03/2018
-- Description: 
-- Exec [dbo].[uspChangeContactUsStatus] 

-- =============================================
CREATE PROCEDURE [dbo].[uspChangeContactUsStatus] 
    @pProfileID	int	 
   ,@pStatusID int
   ,@pContactUsID nvarchar(500)
   ,@pEmail nvarchar(500)
   ,@pUserID nvarchar(500)

AS
BEGIN
    DECLARE	@vStatusName nvarchar(max), 
			@vName nvarchar(max),
			@vAdminName nvarchar(max)

	BEGIN TRY

    Select @vStatusName=title	from Lookup.tblContactUsStatus where queryStatusID=@pStatusID	

	   
    IF ISNULL(@pProfileID,0) > 0
	BEGIN
	    SELECT @vName=username from  [Profile].[tblUser] where profileID=@pProfileID
		SELECT @vAdminName=firstName +' '+lastName from  [Profile].[tblUser] where profileID=@pProfileID


		UPDATE [dbo].[tblContactUs]
	    SET
		   queryStatusID=@pStatusID
		  ,[dateModified] = GETDATE()
		  ,[modifiedBy] = @pProfileID
	    WHERE contactUsID in (select SplitResult from Function_Split(@pContactUsID , ','))


		
		 Insert into tblLogTimeline
				(profileID,dateCreated,dateModified,isActive,isDeleted,description)
				 Values (@pProfileID,GETDATE(),GETDATE(),1,0,@vAdminName+' updated contact us query status to '+@vStatusName +' against email: <b> '+ @pEmail +'</b> email.')
	END

	--IF ISNULL(@pUserID,'')
	--BEGIN
	--   	 Insert into tblLogTimeline
	--			(profileID,dateCreated,dateModified,isActive,isDeleted,description)
	--			 Values (@pUserID,GETDATE(),GETDATE(),1,0,'Your query status has been updated to '+@vStatusName + '.')
	--END
	
	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [dbo].[uspDeleteNotification]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 12/07/2018
-- Description:	Admin Notification 
-- Exec [dbo].[uspDeleteNotification] 1,1


-- =============================================
CREATE PROCEDURE  [dbo].[uspDeleteNotification] 
    @pNoticeID	int	 
   ,@pProfileID		int

AS
BEGIN
	BEGIN TRY
    DECLARE	@vName nvarchar(max)
	   
    IF ISNULL(@pNoticeID,0) > 0
	BEGIN
	    SELECT @vName=title from  [dbo].[tblNotification] where notificationID=@pNoticeID

		UPDATE  [dbo].[tblNotification] 
	    SET
		   isDeleted=1
		  ,[dateModified] = GETDATE()
		  ,[modifiedBy] = @pProfileID
	    WHERE notificationID=@pNoticeID

		
		 Insert into tblLogTimeline
				(profileID,dateCreated,dateModified,isActive,isDeleted,description)
				 Values (@pProfileID,GETDATE(),GETDATE(),1,0,'Delete a notification <b>'+ @vName +'</b>.')
	END
	
	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [dbo].[uspGetAdminDashboard]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 12/07/2018
-- Description: Get Admin Dashboard
-- Exec [dbo].[uspGetAdminDashboard] 1

-- =============================================
CREATE PROCEDURE [dbo].[uspGetAdminDashboard]

				@pAdminID int	
AS
BEGIN
	BEGIN TRY
	DECLARE @vTotalIncome nvarchar(500)
	DECLARE @vOldIncome float
	DECLARE @vNewIncome float
	DECLARE @vLastWeekIncome float
    DECLARE @vTodayIncome float

	DECLARE @vNewFactRecDate datetime
	DECLARE @vOldFactRecDate datetime
		   
	DECLARE @vTotalSellerNL int
	DECLARE @vTotalSellerPK int

	DECLARE @vTotalBuyerNL int
	DECLARE @vTotalBuyerPK int

	DECLARE @vTotalCategories int
	DECLARE @vTotalNotices int

	--- GET TIMELINE DATA
	 SELECT Top 10 
	  logi.profileID
	 ,logi.timelineID
	 ,logi.description
	 ,logi.dateCreated
	 FROM dbo.tblLogTimeline as logi
	 WHERE logi.profileID=@pAdminID
	 Order by logi.timelineID  DESC

	--- GET NOTIFICATION DATA
	  SELECT Top 5
	  note.notificationID
	 ,note.title
	 ,note.isRead 
	 ,note.dateCreated
	 FROM dbo.tblNotification as note
	 WHERE note.groupID=3 
	 Order by note.notificationID  DESC

	 SELECT @vTotalNotices=count(*)
	 FROM dbo.tblNotification as note
	 WHERE note.groupID=3 and isRead=0
	

	--- GET CONTACT US DATA
	 SELECT Top 5 
	  con.contactUsID
	 ,con.query
	 ,con.dateCreated
	 ,ct.title as queryType
	 FROM dbo.tblContactUs as con
	 Inner Join Lookup.tblContactUsType as ct on  ct.queryTypeID=con.queryTypeID
	 WHERE con.isActive=1
	 and con.isDeleted=0
	 Order by con.contactUsID  DESC

  	--- GET SELLER COUNT NL
	 SELECT @vTotalSellerNL= Count(distinct sel.profileID)
	 FROM Profile.tblSeller as sel
	 inner join Profile.tblUserAddress as usr on usr.profileID=sel.profileID
	 WHERE sel.isActive=1
	 and sel.isDeleted=0
	 and sel.registrationStatusID in (4)
	 and usr.countryID=1 and usr.addressTypeID=4

	 --- GET SELLER COUNT PK
	 SELECT @vTotalSellerPK= Count(distinct sel.profileID)
	 FROM Profile.tblSeller as sel
	 inner join Profile.tblUserAddress as usr on usr.profileID=sel.profileID
	 WHERE sel.isActive=1
	 and sel.isDeleted=0
	-- and sel.registrationStatusID in (4)
	 and usr.countryID=2 and usr.addressTypeID=4
	 
	 --- GET BUYER COUNT NL
	 SELECT @vTotalBuyerPK= Count(distinct sel.profileID)
	  FROM Profile.tblUser as sel
	-- inner join Profile.tblUserAddress as usr on usr.profileID=sel.profileID
	 WHERE sel.isActive=1
	 and sel.isDeleted=0
	 and sel.profileID in (select distinct profileID from Profile.tblUserRole where roleID in (4) and isDeleted=0 )
	 and sel.countryID=2
	 --and usr.addressTypeID=4

	 --- GET BUYER COUNT PK
	 SELECT @vTotalBuyerNL= Count(distinct sel.profileID)
	 FROM Profile.tblUser as sel
	-- inner join Profile.tblUserAddress as usr on usr.profileID=sel.profileID
	 WHERE sel.isActive=1
	 and sel.isDeleted=0
	 and sel.profileID in (select distinct profileID from Profile.tblUserRole where roleID in (4) and isDeleted=0 )
	 and sel.countryID=1
	 --and usr.addressTypeID=4 

	 --- GET CATEGORY DATA
	 select @vTotalCategories=count(*) from Product.tblCategory where isDeleted=0 and isActive=1

	 SELECT m.categoryID,m.profileID,cat.name
	 INTO #temp1
	 FROM Product.tblMeal m
	 inner join Product.tblCategory as cat on cat.categoryID=m.categoryID
	 GROUP BY m.categoryID,profileID,cat.name

	 SELECT DISTINCT count(profileID) as tcount,name,categoryID
	 into #temp2
	 FROM #temp1
	 GROUP BY categoryID,name,categoryID

      SELECT 
	    cat.categoryID
	  , ISNULL(cat.name,'unknown') as name
	  , ISNULL(tp.tcount,0) as totalCount
	  ,((100*ISNULL(tp.tcount,0))/@vTotalCategories) as percentage
	  ,@vTotalCategories as totalCategories
	  into #temp3
	  FROM   #temp2  as tp
      right outer join Product.tblCategory as cat on cat.categoryID=tp.categoryID
	  WHERE cat.isActive=1 and isDeleted=0

	 select *,	  
	(CASE WHEN percentage  >= 80 THEN 'H' 
		  WHEN (percentage <= 80 and percentage >= 50) THEN 'M'  
		  WHEN  percentage <= 50 THEN 'L' END) as  clevel
	from #temp3

	
	drop table #temp1
	drop table #temp2
	drop table #temp3

	 --- GET FACTUAL DATA
	 IF EXISTS (select count(*) from dbo.tblLogFact)
	 BEGIN

		 SELECT Top 1 
		    @vOldIncome=Cast(totalComission as float)
		  , @vOldFactRecDate=utcLogDate 
		  FROM dbo.tblLogFact 
		  order by factLogID DESC

	 END



	 SELECT  @vNewIncome=sum(cast(pay.commisionAmount as float)) from Product.tblPayment  as pay
	 WHERE pay.paymentStatusID=1 
	 and pay.isDeleted=0 
	 and pay.isActive=1
	 and transactionDate > CONVERT(datetime,@vOldFactRecDate)

	 SELECT  @vLastWeekIncome=sum(cast(pay.commisionAmount as float)) from Product.tblPayment  as pay
	 WHERE pay.paymentStatusID=1 
	 and pay.isDeleted=0 
	 and pay.isActive=1
	 and transactionDate >= dateadd(day, 1-datepart(dw, getdate()), CONVERT(date,getdate())) 
	 and transactionDate <  dateadd(day, 8-datepart(dw, getdate()), CONVERT(date,getdate()))

	 SELECT  @vTodayIncome=sum(cast(pay.commisionAmount as float)) from Product.tblPayment  as pay
	 WHERE pay.paymentStatusID=1 
	 and pay.isDeleted=0 
	 and pay.isActive=1
	 and Cast(transactionDate as date) = Cast(GETUTCDATE() as date)

	 SELECT Top 1 @vNewFactRecDate=pay.transactionDate from Product.tblPayment  as pay
	 WHERE pay.paymentStatusID=1 
	 and pay.isDeleted=0 
	 and pay.isActive=1
	 and transactionDate > CONVERT(datetime,@vOldFactRecDate)
	 Order By pay.paymentID desc


	 SET @vTotalIncome=Convert(nvarchar,(@vOldIncome + @vNewIncome))


	  --- INSERT NEW FACTUAL DATA
	 INSERT INTO [dbo].[tblLogFact]
           ([factLogID]
           ,[totalComission]
           ,[utcLogDate]
           ,[isActive]
           ,[isDeleted]
           ,[dateModified]
           ,[dateCreated])
     VALUES
           (Next Value for [dbo].[Seq_tblLogFact]  
           ,@vTotalIncome
           ,@vNewFactRecDate
           ,1
           ,0
           ,GETUTCDATE()
           ,GETUTCDATE())
	 

	  SELECT ISNULL(Convert(nvarchar,@vOldIncome),'0')as oldIncome
	 ,@vOldFactRecDate as oldFactDate
	 ,ISNULL(Convert(nvarchar,@vNewIncome),'0') as newIncome
	 ,@vNewFactRecDate as newFactDate
	 ,ISNULL(Convert(nvarchar,@vTotalIncome),'0')  as totalIncome
	 ,ISNULL(Convert(nvarchar,@vLastWeekIncome),'0') as lastWeekIncome
	 ,ISNULL(Convert(nvarchar,@vTodayIncome),'0') as todayIncome 
	 ,ISNULL(@vTotalSellerNL,0) as NLSeller
	 ,ISNULL(@vTotalSellerPK,0) as PKSeller
	 ,ISNULL(@vTotalSellerNL,0) + ISNULL(@vTotalSellerPK,0) as totalSeller
	 ,ISNULL(@vTotalBuyerNL,0) as NLBuyer
	 ,ISNULL(@vTotalBuyerPK,0) as PKBuyer
	 ,ISNULL(@vTotalNotices,0) as totalNotice


	END TRY
	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
	END CATCH
END



GO
/****** Object:  StoredProcedure [dbo].[uspGetAllAdminNotification]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 12/07/2018
-- Description:	
-- Exec  [dbo].[uspGetAllAdminNotification] null,0,0,0,0,1,15,'noti.title',1,null

-- =============================================
CREATE PROCEDURE [dbo].[uspGetAllAdminNotification]

				@pSearchText				NVARCHAR(500) =NULL,
				@pCountryID				    int =0,
				@pCityID				    int =0,
				@pGroupID					int=0,
				@pTypeID					int=0,
				@pPageNumber				INT = 1,
				@pPageSize					INT = 15,
				@pSortColumn     			NVARCHAR(250) = NULL,
				@pSortColumnIndex			TINYINT=0,
				@pNoticeDate				 DateTime =NULL
				 
AS
BEGIN
	BEGIN TRY
	DECLARE		@Query			nvarchar(max),
				@vCriteria		nVarchar(Max),
				@vOrderBy		nvarchar(max),
				@vSortColumn	nvarchar(max),
				@curDate		date = getdate(),
				@vCriteria1		nVarchar(Max)

	IF (ISNULL(@pPageNumber,0) = 0) SET @pPageNumber=1  
	IF (ISNULL(@pPageSize,0) = 0)  SET @pPageSize=10  
		
	IF(@pSortColumnIndex < 1)  
		SET @vSortColumn = ' ASC'  
	ELSE  
		SET @vSortColumn = ' DESC'

	SET @vSortColumn = @pSortColumn + @vSortColumn
	Set @vCriteria	 = ' WHERE  noti.isDeleted=0 '

    IF isnull(@pCountryID,0 )<> 0 SET @vCriteria = @vCriteria + Char(13) + 'and noti.countryID = ' +  Cast(@pCountryID as nvarchar(20)) 
	IF isnull(@pCityID,0 )<> 0 SET @vCriteria = @vCriteria + Char(13) + 'and noti.cityID = '+  Cast(@pCityID as nvarchar(20)) 
	IF isnull(@pGroupID,0 )<> 0 SET @vCriteria = @vCriteria + Char(13) + 'and noti.groupID = '+  Cast(@pGroupID as nvarchar(20)) 
	IF isnull(@pTypeID,0 )<> 0 SET @vCriteria = @vCriteria + Char(13) + 'and noti.notificationType = '+  Cast(@pTypeID as nvarchar(20))

	IF isnull(@pSearchText,'' )<> '' SET @vCriteria = @vCriteria + Char(13) + 'and (noti.title like ''%' + @pSearchText + '%'' OR typ.title like ''%' + @pSearchText + '%'' OR grp.title like ''%' + @pSearchText + '%'')'
	
	IF isnull(@pNoticeDate,0 )<> 0 SET @vCriteria = @vCriteria + Char(13) + 'and CONVERT(date, noti.noticeDate)= '''+  Cast(CONVERT(date, @pNoticeDate) as nvarchar(20)) +''''
	


	SET @vOrderBy =' ORDER BY	1'+/*@vSortColumn*/+Char(13)
	SET @vOrderBy =@vOrderBy+ ' OFFSET ( '+Cast(@pPageSize as nvarchar(20)) +'* ( '+Cast(@pPageNumber as nvarchar(20))+'-1)) ROWS'+Char(13)
	SET @vOrderBy =@vOrderBy+  ' FETCH NEXT '+ Cast(@pPageSize as nvarchar(20)) +' ROWS ONLY	'+Char(13)

	SET @Query = ' SELECT Row_number() over (order by ' + @vSortColumn+' ) as RowNum	
      ,noti.[notificationID]	
      ,noti.[senderID]
      ,noti.[receiverID]
      ,noti.[notice]
      ,noti.[notificationType] as notificationTypeID
	  ,typ.title as notificationType
      ,noti.[isRead]
      ,noti.[isActive]
      ,noti.[isDeleted]
      ,noti.[dateModified]
      ,noti.[dateCreated]
      ,noti.[title]
      ,noti.[countryID]
	  ,cont.country as country
      ,noti.[cityID]
	  ,cit.[city] as city
      ,noti.[groupID]
	  ,grp.title as groupTitle
      ,noti.[isGroupNotice]
	  ,noti.noticeDate
	  ,Count(1) over()	AS TotalRecords 
	  FROM [dbo].[tblNotification] as noti
	  Inner join [Lookup].[tblCountry] as cont ON cont.countryID=noti.countryID
      Inner join [Lookup].[tblCity] as cit ON cit.cityID=noti.cityID
	  Inner join [Lookup].[tblNotificationType] as typ ON typ.notificationTypeID=noti.notificationType
	  Inner join [Lookup].[tblNotificationGroup] as grp ON grp.notificationGroupID=noti.groupID
	'+ +Char(13)+@vCriteria+@vOrderBy
	
	Print substring(@Query , 0 , 4000)
	Exec sp_executesql @Query

	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [dbo].[uspGetAllBuyerNotification]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 12/07/2018
-- Description:	
-- Exec  [dbo].[uspGetAllBuyerNotification] null,0,0,0,12,1,10,'noti.title',1,null

-- =============================================
CREATE PROCEDURE [dbo].[uspGetAllBuyerNotification]

				@pSearchText				NVARCHAR(500) =NULL,
				@pCountryID				    int =0,
				@pCityID				    int =0,
				@pTypeID					int=0,
				@pProfileID					int=0,
				@pPageNumber				INT = 1,
				@pPageSize					INT = 15,
				@pSortColumn     			NVARCHAR(250) = NULL,
				@pSortColumnIndex			TINYINT=1,
				@pNoticeDate				 DateTime =NULL
				 
AS
BEGIN
	BEGIN TRY
	DECLARE		@Query			nvarchar(max),
				@vCriteria		nVarchar(Max),
				@vOrderBy		nvarchar(max),
				@vSortColumn	nvarchar(max),
				@curDate		date = getdate(),
				@vCriteria1		nVarchar(Max),
			    @vList nvarchar(max)

	DECLARE		@tblTempNotice	table (ID int) 

	IF (ISNULL(@pPageNumber,0) = 0) SET @pPageNumber=1  
	IF (ISNULL(@pPageSize,0) = 0)  SET @pPageSize=10  

	 INSERT INTO @tblTempNotice
	 SELECT [notificationID]
	 FROM [dbo].[tblNotification] as noti
	 WHERE  noti.receiverID=@pProfileID
	 ORDER BY notificationID DESC

	  INSERT INTO @tblTempNotice
	  SELECT [notificationID]
	  FROM [dbo].[tblNotification] as noti
	  WHERE  groupID in (2,4) and isGroupNotice=1 and ((noti.countryID <> null or noti.countryID <> 0) or noti.countryID = @pCountryID)
	  and ((noti.cityID <> null or noti.cityID <> 0) or noti.cityID = @pCityID)


	select @vList = coalesce(@vList + ', ', '') + cast(ID as nvarchar(5))from @tblTempNotice
		
	IF(@pSortColumnIndex < 1)  
		SET @vSortColumn = ' ASC'  
	ELSE  
		SET @vSortColumn = ' DESC'

	SET @vSortColumn = @pSortColumn + @vSortColumn
	Set @vCriteria	 = ' WHERE  noti.isDeleted=0 and noti.receiverID='+  Cast(@pProfileID as nvarchar(20)) + ' or noti.groupID in (2,4) and noti.isSeller=0'

 --   IF isnull(@pCountryID,0 )<> 0 SET @vCriteria = @vCriteria + Char(13) + 'and noti.countryID = ' +  Cast(@pCountryID as nvarchar(20)) 
	--IF isnull(@pCityID,0 )<> 0 SET @vCriteria = @vCriteria + Char(13) + 'and noti.cityID = '+  Cast(@pCityID as nvarchar(20)) 
	--IF isnull(@pTypeID,0 )<> 0 SET @vCriteria = @vCriteria + Char(13) + 'and noti.notificationType = '+  Cast(@pTypeID as nvarchar(20))

	--IF isnull(@pSearchText,'' )<> '' SET @vCriteria = @vCriteria + Char(13) + 'and (noti.title like ''%' + @pSearchText + '%'' OR typ.title like ''%' + @pSearchText + '%'' OR grp.title like ''%' + @pSearchText + '%'')'
	
	--IF isnull(@pNoticeDate,0 )<> 0 SET @vCriteria = @vCriteria + Char(13) + 'and CONVERT(date, noti.noticeDate)= '''+  Cast(CONVERT(date, @pNoticeDate) as nvarchar(20)) +''''
	

	Set @vCriteria	 = ' WHERE noti.isDeleted=0'
	SET @vCriteria = @vCriteria + Char(13) + ' and noti.notificationID in ('+ @vList +')'
	IF isnull(@pTypeID,0 )<> 0 SET @vCriteria = @vCriteria + Char(13) + 'and noti.notificationType = '+  Cast(@pTypeID as nvarchar(20))

	IF isnull(@pSearchText,'' )<> '' SET @vCriteria = @vCriteria + Char(13) + 'and (noti.title like ''%' + @pSearchText + '%'' OR typ.title like ''%' + @pSearchText + '%'' OR grp.title like ''%' + @pSearchText + '%'')'
	IF isnull(@pNoticeDate,0 )<> 0 SET @vCriteria = @vCriteria + Char(13) + 'and CONVERT(date, noti.noticeDate)= '''+  Cast(CONVERT(date, @pNoticeDate) as nvarchar(20)) +''''

	SET @vOrderBy =' ORDER BY	1'+/*@vSortColumn*/+Char(13)
	SET @vOrderBy =@vOrderBy+ ' OFFSET ( '+Cast(@pPageSize as nvarchar(20)) +'* ( '+Cast(@pPageNumber as nvarchar(20))+'-1)) ROWS'+Char(13)
	SET @vOrderBy =@vOrderBy+  ' FETCH NEXT '+ Cast(@pPageSize as nvarchar(20)) +' ROWS ONLY	'+Char(13)

	SET @Query = ' SELECT Row_number() over (order by ' + @vSortColumn+' ) as RowNum	
      ,noti.[notificationID]	
      ,ISNULL(noti.[senderID],0) as senderID
      ,ISNULL(noti.[receiverID],0) as receiverID
      ,CASE WHEN noti.isGroupNotice=1 THEN isnull(noti.[title],noti.[notice]) ELSE isnull(noti.[notice],'''') END as notice
	  ,ISNULL(ISNULL(logo,bannarPhoto),''Logo-small.png'') as logo
      ,noti.[notificationType] as notificationTypeID
	  --,typ.title as notificationType
      ,ISNULL(noti.[isRead],0) as [isRead]
      ,noti.[isActive]
      ,noti.[isDeleted]
      ,noti.[dateModified]
      ,noti.[dateCreated]
      ,LOWER(CASE WHEN noti.isGroupNotice=1 THEN typ.title ELSE noti.title END) as title
      ,ISNULL(noti.[countryID],0) as [countryID]
	  ,cont.country as country
      ,ISNULL(noti.[cityID],0) as cityID
	  ,cit.[city] as city
      ,ISNULL(noti.[groupID],0) as groupID
	  ,noti.noticeDate
	  ,grp.title as groupTitle
      ,noti.[isGroupNotice]
	  ,Count(1) over()	AS TotalRecords 
	  FROM [dbo].[tblNotification] as noti
	  LEFT  OUTER  JOIN Profile.tblSeller as sel ON sel.profileID=noti.senderID
	  LEFT  OUTER  JOIN [Lookup].[tblCountry] as cont ON cont.countryID=noti.countryID
      LEFT  OUTER  JOIN [Lookup].[tblCity] as cit ON cit.cityID=noti.cityID
	  LEFT  OUTER  JOIN [Lookup].[tblNotificationType] as typ ON typ.notificationTypeID=noti.notificationType
	  LEFT  OUTER  JOIN [Lookup].[tblNotificationGroup] as grp ON grp.notificationGroupID=noti.groupID
	'+ +Char(13)+@vCriteria+@vOrderBy
	
	Print substring(@Query , 0 , 4000)
	Exec sp_executesql @Query

	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [dbo].[uspGetAllCountries]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 10/04/2018
-- Description:	
-- Exec [dbo].[uspGetAllCountries]

-- =============================================
CREATE PROCEDURE [dbo].[uspGetAllCountries]
	  
AS
BEGIN
	BEGIN TRY

		SELECT [countryID]
		  ,[country]
		  ,[currency]
		  ,[VAT]
		  ,[commisionValue]
		  ,[isActive]
		  ,[isDeleted]
		  ,[dateModified]
		  ,[dateCreated]
		FROM [Lookup].[tblCountry]
		WHERE isDeleted=0 

	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [dbo].[uspGetAllSellerNotification]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 12/07/2018
-- Description:	
-- Exec  [dbo].[uspGetAllSellerNotification] null,0,0,0,12,1,12,'noti.title',1,null

-- =============================================
CREATE PROCEDURE [dbo].[uspGetAllSellerNotification]

				@pSearchText				NVARCHAR(500) =NULL,
				@pCountryID				    int =0,
				@pCityID				    int =0,
				@pTypeID					int=0,
				@pProfileID					int=0,
				@pPageNumber				INT = 1,
				@pPageSize					INT = 15,
				@pSortColumn     			NVARCHAR(250) = NULL,
				@pSortColumnIndex			TINYINT=1,
				@pNoticeDate				 DateTime =NULL
				 
AS
BEGIN
	BEGIN TRY
	DECLARE		@Query			nvarchar(max),
				@vCriteria		nVarchar(Max),
				@vOrderBy		nvarchar(max),
				@vSortColumn	nvarchar(max),
				@curDate		date = getdate(),
				@vCriteria1		nVarchar(Max),
				@vList nvarchar(max)

	DECLARE		@tblTempNotice	table (ID int) 

	IF (ISNULL(@pPageNumber,0) = 0) SET @pPageNumber=1  
	IF (ISNULL(@pPageSize,0) = 0)  SET @pPageSize=10  
		
	 INSERT INTO @tblTempNotice
	 SELECT [notificationID]
	 FROM [dbo].[tblNotification] as noti
	 WHERE  noti.receiverID=@pProfileID
	 ORDER BY notificationID DESC

	  INSERT INTO @tblTempNotice
	  SELECT [notificationID]
	  FROM [dbo].[tblNotification] as noti
	  WHERE  groupID in (1,4) and isGroupNotice=1 and ((noti.countryID <> null or noti.countryID <> 0) or noti.countryID = @pCountryID)
	  and ((noti.cityID <> null or noti.cityID <> 0) or noti.cityID = @pCityID)


	select @vList = coalesce(@vList + ', ', '') + cast(ID as nvarchar(5))from @tblTempNotice

	IF(@pSortColumnIndex < 1)  
		SET @vSortColumn = ' ASC'  
	ELSE  
		SET @vSortColumn = ' DESC'

	--SET @vSortColumn = @pSortColumn + @vSortColumn
	  Set @vCriteria	 = ' WHERE noti.isDeleted=0' --   and noti.receiverID='+  Cast(@pProfileID as nvarchar(20)) + ' or noti.groupID in (1,4) and noti.isSeller=1'
     --SET @vCriteria =  @vCriteria + Char(13) + ' and noti.notificationID in ('''+ Cast( select ID from @tblTempNotice) as nvarchar(500)) +''')'
	SET @vCriteria = @vCriteria + Char(13) + ' and noti.notificationID in ('+ @vList +')'
    --IF isnull(@pCountryID,0 )<> 0 SET @vCriteria = @vCriteria + Char(13) + 'and noti.countryID = ' +  Cast(@pCountryID as nvarchar(20)) 
	--IF isnull(@pCityID,0 )<> 0 SET @vCriteria = @vCriteria + Char(13) + 'and noti.cityID = '+  Cast(@pCityID as nvarchar(20)) 
	IF isnull(@pTypeID,0 )<> 0 SET @vCriteria = @vCriteria + Char(13) + 'and noti.notificationType = '+  Cast(@pTypeID as nvarchar(20))


	--SET @vCriteria =  @vCriteria + Char(13) + ' and noti.notificationID in ('+ (select ID from @tblTempNotice) + ')'

	IF isnull(@pSearchText,'' )<> '' SET @vCriteria = @vCriteria + Char(13) + 'and (noti.title like ''%' + @pSearchText + '%'' OR typ.title like ''%' + @pSearchText + '%'' OR grp.title like ''%' + @pSearchText + '%'')'
	IF isnull(@pNoticeDate,0 )<> 0 SET @vCriteria = @vCriteria + Char(13) + 'and CONVERT(date, noti.noticeDate)= '''+  Cast(CONVERT(date, @pNoticeDate) as nvarchar(20)) +''''
	
		--Print substring(@vCriteria , 0 , 4000)


	SET @vOrderBy =' ORDER BY	1'+ @vSortColumn +Char(13)
	SET @vOrderBy =@vOrderBy+ ' OFFSET ( '+Cast(@pPageSize as nvarchar(20)) +'* ( '+Cast(@pPageNumber as nvarchar(20))+'-1)) ROWS'+Char(13)
	SET @vOrderBy =@vOrderBy+  ' FETCH NEXT '+ Cast(@pPageSize as nvarchar(20)) +' ROWS ONLY	'+Char(13)

	--SET @vCriteria =  @vCriteria + Char(13) + ' noti.notificationID in ('+ Cast ((select ID from @tblTempNotice) as nvarchar(500)) +''')'


	SET @Query = ' SELECT Row_number() over (order by notificationID) as RowNum	
    ,noti.[notificationID]	
      ,ISNULL(noti.[senderID],0) as senderID
      ,ISNULL(noti.[receiverID],0) as receiverID
      ,CASE WHEN noti.isGroupNotice=1 THEN isnull(noti.[title],noti.[notice]) ELSE isnull(noti.[notice],'''') END as notice
	  ,ISNULL(profilePhoto,''Logo-small.png'') as logo
      ,noti.[notificationType] as notificationTypeID
	  --,typ.title as notificationType
      ,ISNULL(noti.[isRead],0) as [isRead]
      ,noti.[isActive]
      ,noti.[isDeleted]
      ,noti.[dateModified]
      ,noti.[dateCreated]
      ,LOWER(CASE WHEN noti.isGroupNotice=1 THEN typ.title ELSE noti.title END) as title
      ,ISNULL(noti.[countryID],0) as [countryID]
	  ,cont.country as country
      ,ISNULL(noti.[cityID],0) as cityID
	  ,cit.[city] as city
      ,ISNULL(noti.[groupID],0) as groupID
	  ,noti.noticeDate
	  ,isnull(grp.title,'''') as groupTitle
      ,noti.[isGroupNotice]
	  ,Count(1) over()	AS TotalRecords 
	  FROM [dbo].[tblNotification] as noti
	  LEFT  OUTER  JOIN Profile.tblUser as sel ON sel.profileID=noti.senderID
	  LEFT  OUTER  JOIN [Lookup].[tblCountry] as cont ON cont.countryID=noti.countryID
      LEFT  OUTER  JOIN [Lookup].[tblCity] as cit ON cit.cityID=noti.cityID
	  LEFT  OUTER  JOIN [Lookup].[tblNotificationType] as typ ON typ.notificationTypeID=noti.notificationType
	  LEFT  OUTER  JOIN [Lookup].[tblNotificationGroup] as grp ON grp.notificationGroupID=noti.groupID
	'+ +Char(13)+@vCriteria+@vOrderBy
	
	Print substring(@Query , 0 , 4000)
	Exec sp_executesql @Query

	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [dbo].[uspGetBuyerTopNotifications]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 12/07/2018
-- Description:	deal By ID
-- Exec  [dbo].[uspGetBuyerTopNotifications] 13

-- =============================================
CREATE PROCEDURE [dbo].[uspGetBuyerTopNotifications]

				@pBuyerID int	 
AS
BEGIN
	BEGIN TRY
       
	   DECLARE @vReadCount int,@vCountryID int=0,@vCityID int=0
	 DECLARE @tblTempNotice table (ID int) 
	 DECLARE @tblReadGroupNotice table (ID int) 



	 SELECT @vCountryID=countryID, @vCityID=cityID from profile.tblUserAddress where profileID=@pBuyerID and addressTypeID=4
	 IF EXISTS(SELECT * from profile.tblUserAddress where profileID=@pBuyerID and addressTypeID=4)
	 BEGIN
	  SELECT @vCountryID=countryID, @vCityID=cityID from profile.tblUserAddress where profileID=@pBuyerID and addressTypeID=4
	 END
	 ELSE IF EXISTS(SELECT * from profile.tblUserAddress where profileID=@pBuyerID and addressTypeID=2)
	 BEGIN
	  SELECT @vCountryID=countryID, @vCityID=cityID from profile.tblUserAddress where profileID=@pBuyerID and addressTypeID=2
	 END
	 ELSE
	 BEGIN
	   SELECT Top 1 @vCountryID=countryID, @vCityID=cityID from profile.tblUserAddress where profileID=@pBuyerID 
	 END

	 INSERT INTO @tblTempNotice
	 SELECT TOP 5
		[notificationID]
	 FROM [dbo].[tblNotification] as noti
	 WHERE  noti.receiverID=@pBuyerID and isSeller=0
	 ORDER BY notificationID DESC

	  INSERT INTO @tblTempNotice
	  SELECT [notificationID]
	  FROM [dbo].[tblNotification] as noti
	  WHERE  groupID in (2,4) and isGroupNotice=1 and ((noti.countryID <> null or noti.countryID <> 0) or noti.countryID = @vCountryID)
	  and ((noti.cityID <> null or noti.cityID <> 0) or noti.cityID = @vCityID)
	  ORDER BY notificationID DESC

	  INSERT INTO @tblReadGroupNotice
	  SELECT [groupNotificationID]  
	  FROM [dbo].[tblNotificationReadStatus] as noti
	  WHERE  profileID=@pBuyerID and groupNotificationID in (select ID from  @tblTempNotice)
	  ORDER BY groupNotificationID DESC

	 	  IF((select count(*) from @tblReadGroupNotice) > 0)
	  BEGIN
	  SELECT @vReadCount=count(*) from [dbo].[tblNotification]  where isGroupNotice=1 and notificationID not in (select  ID from @tblReadGroupNotice) and isDeleted=0 and isActive=1 and  groupID in (2,4) and ((countryID <> null or countryID <> 0) or countryID = @vCountryID)
	  and ((cityID <> null or cityID <> 0) or cityID = @vCityID)
	  END
	  ELSE 
	  BEGIN
		SELECT @vReadCount=count(*) from [dbo].[tblNotification]  where  groupID in (2,4) and isGroupNotice=1 and isDeleted=0 and isActive=1 and ((countryID <> null or countryID <> 0) or countryID = @vCountryID)
	  and ((cityID <> null or cityID <> 0) or cityID = @vCityID)
	  END

	 SELECT @vReadCount=ISNULL(@vReadCount,0) + count(*) from [dbo].[tblNotification]  where receiverID=@pBuyerID and isRead=0 and isGroupNotice=0 and isDeleted=0 and isActive=1 


	 SELECT TOP 5
       noti.[notificationID]	
	   ,@vReadCount as readCount	
     ,isnull(noti.[senderID],0) as senderID
      ,isnull(noti.[receiverID],0) as receiverID
      ,CASE WHEN noti.isGroupNotice=1 THEN isnull(noti.[title],noti.[notice]) ELSE isnull(noti.[notice],'') END as notice
	  ,ISNULL(ISNULL(logo,bannarPhoto),'Logo-small.png') as logo
      ,noti.[notificationType] as notificationTypeID
	  --,typ.title as notificationType
      ,ISNULL(noti.[isRead],0) as [isRead]
      ,noti.[isActive]
      ,noti.[isDeleted]
      ,noti.[dateModified]
      ,noti.[dateCreated]
      ,LOWER(CASE WHEN noti.isGroupNotice=1 THEN typ.title ELSE noti.title END) as title
      ,ISNULL(noti.[countryID],0) as [countryID]
	  ,cont.country as country
      ,ISNULL(noti.[cityID],0) as cityID
	  ,cit.[city] as city
      ,ISNULL(noti.[groupID],0) as groupID
	  ,noti.noticeDate
	  ,grp.title as groupTitle
      ,noti.[isGroupNotice]
	  FROM [dbo].[tblNotification] as noti
	  LEFT  OUTER  JOIN Profile.tblSeller as sel ON sel.profileID=noti.senderID
	  LEFT  OUTER  JOIN [Lookup].[tblCountry] as cont ON cont.countryID=noti.countryID
      LEFT  OUTER  JOIN [Lookup].[tblCity] as cit ON cit.cityID=noti.cityID
	  LEFT  OUTER  JOIN [Lookup].[tblNotificationType] as typ ON typ.notificationTypeID=noti.notificationType
	  LEFT  OUTER  JOIN [Lookup].[tblNotificationGroup] as grp ON grp.notificationGroupID=noti.groupID
	WHERE   noti.notificationID in (select ID from @tblTempNotice)
	ORDER BY notificationID DESC

	END TRY
	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [dbo].[uspGetByCountryID]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 12/07/2018
-- Description: Country Information
-- Exec [dbo].[uspGetByCountryID] 1

-- =============================================
CREATE PROCEDURE [dbo].[uspGetByCountryID]

				@pCountryID int	 
AS
BEGIN
	BEGIN TRY
       
	  SELECT [countryID]
      ,[country]
      ,con.[currency]
	  ,curr.sign as currSign
	  ,dunit.unit as unit
      ,[VAT]
      ,[commisionValue]
      ,con.[isActive]
      ,con.[isDeleted]
      ,con.[dateModified]
      ,con.[dateCreated]
      ,con.[distanceUnitID]
	  ,con.rate
      ,[isHalal]
      ,[dateActivated]
	 FROM [Lookup].[tblCountry] as con
	 LEFT OUTER JOIN lookup.tblCurrency as curr ON curr.currencyID=con.currency
	 LEFT OUTER JOIN lookup.tblDistanceUnit as dunit ON dunit.unitID=con.distanceUnitID
	 WHERE [countryID]=@pCountryID

	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [dbo].[uspGetContactUs]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 06/07/2018
-- Description:	All Contact Us Queries
-- Exec  [dbo].[uspGetContactUs] '',1,10,'email',1

-- =============================================
CREATE PROCEDURE [dbo].[uspGetContactUs]

				@pSearchText				NVARCHAR(500),
				@pPageNumber				INT = 1,
				@pPageSize					INT = 15,
				@pSortColumn     			NVARCHAR(250) = NULL,
				@pSortColumnIndex			TINYINT=0
				 
AS
BEGIN
	BEGIN TRY
	DECLARE		@Query			nvarchar(max),
				@vCriteria		nVarchar(Max),
				@vOrderBy		nvarchar(max),
				@vSortColumn	nvarchar(max),
				@curDate		date = getdate(),
				@vCriteria1		nVarchar(Max)

	IF (ISNULL(@pPageNumber,0) = 0) SET @pPageNumber=1  
	IF (ISNULL(@pPageSize,0) = 0)  SET @pPageSize=10  
		
	IF(@pSortColumnIndex < 1)  
		SET @vSortColumn = ' ASC'  
	ELSE  
		SET @vSortColumn = ' DESC'

	SET @vSortColumn = @pSortColumn + @vSortColumn
	Set @vCriteria	 = ' WHERE cus.isDeleted=0 '
	IF isnull(@pSearchText,'')<>'' SET @vCriteria = @vCriteria + Char(13) + 'and email like ''%' + @pSearchText + '%'''


	SET @vOrderBy =' ORDER BY	1'+/*@vSortColumn*/+Char(13)
	SET @vOrderBy =@vOrderBy+ ' OFFSET ( '+Cast(@pPageSize as nvarchar(20)) +'* ( '+Cast(@pPageNumber as nvarchar(20))+'-1)) ROWS'+Char(13)
	SET @vOrderBy =@vOrderBy+  ' FETCH NEXT '+ Cast(@pPageSize as nvarchar(20)) +' ROWS ONLY	'+Char(13)

	SET @Query = ' SELECT Row_number() over (order by ' + @vSortColumn+' ) as RowNum,	
	 	cus.[contactUsID]
	   ,isnull([email],'''') as email
	   ,isnull([name],'''') as name
	   ,isnull([phone],'''') as phone
      ,isnull([query],'''') as query
      ,isnull(cus.[queryTypeID],0) as queryTypeID
	  ,isnull(qt.title,'''') as queryType
	  ,isnull(cus.[queryStatusID],0) as queryStatusID
	  ,isnull(qs.title,'''') as queryStatus
	  ,isnull(reply,'''') as reply
      ,isnull(cus.[isActive],0) as isActive
      ,isnull(cus.[isDeleted],0) as isDeleted
      ,cus.[dateModified]
      ,cus.[dateCreated]
	  ,isnull(cus.isSeller,0) as isSeller
	  ,isnull(cus.isBuyer,0) as isBuyer
	  ,ISNULL(cus.profileID,0) as profileID
	  ,Count(1) over()	AS TotalRecords 
	FROM [dbo].[tblContactUs] as cus
	INNER JOIN [Lookup].[tblContactUsStatus] as qs ON qs.queryStatusID=cus.queryStatusID
	INNER JOIN [Lookup].[tblContactUsType] as qt ON qt.queryTypeID=cus.queryTypeID'++Char(13)+@vCriteria+@vOrderBy
	
	Print substring(@Query , 0 , 4000)
	Exec sp_executesql @Query

	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [dbo].[uspGetNotificationByID]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 12/07/2018
-- Description:	deal By ID
-- Exec  [dbo].[uspGetNotificationByID] 1

-- =============================================
CREATE PROCEDURE [dbo].[uspGetNotificationByID]

				@pNoticeID int	 
AS
BEGIN
	BEGIN TRY
       
	 SELECT
       noti.[notificationID]	
      ,noti.[senderID]
      ,noti.[receiverID]
      ,noti.[notice]
      ,noti.[notificationType] as notificationTypeID
	  ,typ.title as notificationType
      ,noti.[isRead]
      ,noti.[isActive]
      ,noti.[isDeleted]
      ,noti.[dateModified]
      ,noti.[dateCreated]
      ,noti.[title]
      ,noti.[countryID]
	  ,cont.country as country
      ,noti.[cityID]
	  ,cit.[city] as city
      ,noti.[groupID]
	  ,noti.noticeDate
	  ,grp.title as groupTitle
      ,noti.[isGroupNotice]
	  FROM [dbo].[tblNotification] as noti
	  Inner join [Lookup].[tblCountry] as cont ON cont.countryID=noti.countryID
      Inner join [Lookup].[tblCity] as cit ON cit.cityID=noti.cityID
	  Inner join [Lookup].[tblNotificationType] as typ ON typ.notificationTypeID=noti.notificationType
	  Inner join [Lookup].[tblNotificationGroup] as grp ON grp.notificationGroupID=noti.groupID
	WHERE  noti.notificationID=@pNoticeID

	END TRY
	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [dbo].[uspGetSellerTopNotifications]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 12/07/2018
-- Description:	deal By ID
-- Exec  [dbo].[uspGetSellerTopNotifications] 12

-- =============================================
CREATE PROCEDURE [dbo].[uspGetSellerTopNotifications]

				@pSellerID int	 
AS
BEGIN
	BEGIN TRY
     DECLARE @vReadCount int,@vCountryID int=0,@vCityID int=0
	 DECLARE @tblTempNotice table (ID int) 
	 DECLARE @tblReadGroupNotice table (ID int) 



	 SELECT @vCountryID=countryID, @vCityID=cityID from profile.tblUserAddress where profileID=@pSellerID and addressTypeID=4
	 IF EXISTS(SELECT * from profile.tblUserAddress where profileID=@pSellerID and addressTypeID=4)
	 BEGIN
	  SELECT @vCountryID=countryID, @vCityID=cityID from profile.tblUserAddress where profileID=@pSellerID and addressTypeID=4
	 END
	 ELSE IF EXISTS(SELECT * from profile.tblUserAddress where profileID=@pSellerID and addressTypeID=2)
	 BEGIN
	  SELECT @vCountryID=countryID, @vCityID=cityID from profile.tblUserAddress where profileID=@pSellerID and addressTypeID=2
	 END
	 ELSE
	 BEGIN
	   SELECT Top 1 @vCountryID=countryID, @vCityID=cityID from profile.tblUserAddress where profileID=@pSellerID 
	 END

	 INSERT INTO @tblTempNotice
	 SELECT TOP 5
		[notificationID]
	 FROM [dbo].[tblNotification] as noti
	 WHERE  noti.receiverID=@pSellerID and isSeller=1
	 ORDER BY notificationID DESC

	  INSERT INTO @tblTempNotice
	  SELECT [notificationID]
	  FROM [dbo].[tblNotification] as noti
	  WHERE  groupID in (1,4) and isGroupNotice=1 and ((noti.countryID <> null or noti.countryID <> 0) or noti.countryID = @vCountryID)
	  and ((noti.cityID <> null or noti.cityID <> 0) or noti.cityID = @vCityID)
	  ORDER BY notificationID DESC

	  INSERT INTO @tblReadGroupNotice
	  SELECT [groupNotificationID]  
	  FROM [dbo].[tblNotificationReadStatus] as noti
	  WHERE  profileID=@pSellerID and groupNotificationID in (select ID from  @tblTempNotice)
	  ORDER BY groupNotificationID DESC


	  IF((select count(*) from @tblReadGroupNotice) > 0)
	  BEGIN
	  SELECT @vReadCount=count(*) from [dbo].[tblNotification]  where isGroupNotice=1 and notificationID not in (select  ID from @tblReadGroupNotice) and isDeleted=0 and isActive=1 and  groupID in (1,4) and ((countryID <> null or countryID <> 0) or countryID = @vCountryID)
	  and ((cityID <> null or cityID <> 0) or cityID = @vCityID)
	  END
	  ELSE 
	  BEGIN
		SELECT @vReadCount=count(*) from [dbo].[tblNotification]  where  groupID in (1,4) and isGroupNotice=1 and isDeleted=0 and isActive=1 and ((countryID <> null or countryID <> 0) or countryID = @vCountryID)
	  and ((cityID <> null or cityID <> 0) or cityID = @vCityID)
	  END

	 SELECT @vReadCount=ISNULL(@vReadCount,0) + count(*) from [dbo].[tblNotification]  where receiverID=@pSellerID and isRead=0 and isGroupNotice=0 and isDeleted=0 and isActive=1

	 SELECT TOP 5
       noti.[notificationID]
	  ,@vReadCount as readCount	
      ,isnull(noti.[senderID],0) as senderID
      ,isnull(noti.[receiverID],0) as receiverID
      ,isnull(noti.[notice],'') as notice
	  ,CASE WHEN noti.isGroupNotice=1 THEN isnull(noti.[title],noti.[notice]) ELSE isnull(noti.[notice],'') END as notice
	  ,ISNULL(profilePhoto,'Logo-small.png') as logo
      ,noti.[notificationType] as notificationTypeID
      ,ISNULL(noti.[isRead],0) as [isRead]
      ,noti.[isActive]
      ,noti.[isDeleted]
      ,noti.[dateModified]
      ,noti.[dateCreated]
      ,LOWER(CASE WHEN noti.isGroupNotice=1 THEN typ.title ELSE noti.title END) as title
      ,ISNULL(noti.[countryID],0) as [countryID]
	  ,ISNULL(cont.country,'') as country
      ,ISNULL(noti.[cityID],0) as cityID
	  ,ISNULL(cit.[city],'') as city
      ,ISNULL(noti.[groupID],0) as groupID
	  ,noti.noticeDate
	  ,ISNULL(grp.title,'') as groupTitle
      ,noti.[isGroupNotice]
	  FROM [dbo].[tblNotification] as noti
	  LEFT  OUTER  JOIN Profile.tblUser as sel ON sel.profileID=noti.senderID
	  LEFT  OUTER  JOIN [Lookup].[tblCountry] as cont ON cont.countryID=noti.countryID
      LEFT  OUTER  JOIN [Lookup].[tblCity] as cit ON cit.cityID=noti.cityID
	  LEFT  OUTER  JOIN [Lookup].[tblNotificationType] as typ ON typ.notificationTypeID=noti.notificationType
	  LEFT  OUTER  JOIN [Lookup].[tblNotificationGroup] as grp ON grp.notificationGroupID=noti.groupID
	WHERE  noti.notificationID in (select ID from @tblTempNotice)
	ORDER BY notificationID DESC


	END TRY
	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [dbo].[uspGetTimelineData]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 20/03/2018
-- Description:	Product Category
-- Exec dbo.uspGetTimelineData '',1,20,'logi.dateCreated',1,1

-- =============================================
CREATE PROCEDURE [dbo].[uspGetTimelineData]

				@pSearchText				NVARCHAR(500),
				@pPageNumber				INT = 1,
				@pPageSize					INT = 20,
				@pSortColumn     			NVARCHAR(250) = NULL,
				@pSortColumnIndex			TINYINT=0,
				@pProfileID							INT
				 
AS
BEGIN
	BEGIN TRY
	DECLARE		@Query			nvarchar(max),
				@vCriteria		nVarchar(Max),
				@vOrderBy		nvarchar(max),
				@vSortColumn	nvarchar(max),
				@curDate		date = getdate(),
				@vCriteria1		nVarchar(Max)

	IF (ISNULL(@pPageNumber,0) = 0) SET @pPageNumber=1  
	IF (ISNULL(@pPageSize,0) = 0)  SET @pPageSize=20  
		
	IF(@pSortColumnIndex < 1)  
		SET @vSortColumn = ' ASC'  
	ELSE  
		SET @vSortColumn = ' DESC'

	SET @vSortColumn = @pSortColumn + @vSortColumn
	Set @vCriteria	 = ' WHERE logi.isDeleted=0 '
	IF isnull(@pProfileID,0)<> 0  SET @vCriteria = @vCriteria + Char(13) + 'and logi.profileID=' +Cast(@pProfileID as nvarchar(20))+ ''
	IF isnull(@pSearchText,'')<>'' SET @vCriteria = @vCriteria + Char(13) + 'and logi.description like ''%' + @pSearchText + '%'''


	SET @vOrderBy =' ORDER BY	1'+/*@vSortColumn*/+Char(13)
	SET @vOrderBy =@vOrderBy+ ' OFFSET ( '+Cast(@pPageSize as nvarchar(20)) +'* ( '+Cast(@pPageNumber as nvarchar(20))+'-1)) ROWS'+Char(13)
	SET @vOrderBy =@vOrderBy+  ' FETCH NEXT '+ Cast(@pPageSize as nvarchar(20)) +' ROWS ONLY	'+Char(13)

	SET @Query = ' SELECT Row_number() over (order by ' + @vSortColumn+' ) as RowNum,		
	   logi.profileID
	 ,logi.timelineID
	 ,logi.description
	 ,logi.dateCreated
	 ,Count(1) over()	AS TotalRecords 
	FROM dbo.tblLogTimeline as logi'++Char(13)+@vCriteria+@vOrderBy
	
	Print substring(@Query , 0 , 4000)
	Exec sp_executesql @Query

	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [dbo].[uspInsertOrderNotification]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 12/07/2018
-- Description:	Notification
-- Exec [dbo].[uspInsertUpdateNotification] 

-- =============================================
CREATE PROCEDURE [dbo].[uspInsertOrderNotification]

	@pTitle		nvarchar(max)=null
   ,@pNotice	nvarchar(max)=null
   ,@pSenderID  int
   ,@pReceiverID  int
   ,@pIsSeller bit =null
   ,@pNoticeDate datetime
   --,@pProfileID		int
AS
BEGIN
	BEGIN TRY
       
  
		INSERT INTO [dbo].[tblNotification]
           ([notificationID]
           ,[notice]
           ,[notificationType]
		   ,[senderID]
		   ,[receiverID]
           ,[isRead]
           ,[isActive]
           ,[isDeleted]
           ,[dateModified]
           ,[dateCreated]
           ,[title]
           ,[isGroupNotice]
           ,[noticeDate]
		   ,[isSeller])
		VALUES
           (Next Value for [dbo].[Seq_tblNotification] 
           ,@pNotice
           ,2
		   ,@pSenderID
		   ,@pReceiverID
           ,0
           ,1
           ,0
           ,getdate()
           ,getDate()
           ,@pTitle
		   ,0
           ,@pNoticeDate
		   ,@pIsSeller
		   )


	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [dbo].[uspInsertUpdateNotification]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 12/07/2018
-- Description:	Notification
-- Exec [dbo].[uspInsertUpdateNotification] 

-- =============================================
CREATE PROCEDURE [dbo].[uspInsertUpdateNotification]

	@pNotificationID	int=null
   ,@pGroupID	int=null
   ,@pTypeID	int=null
   ,@pCountryID	int=null	
   ,@pCityID	int=null	
   ,@pTitle		nvarchar(max)=null
   ,@pNotice	nvarchar(max)=null
   ,@pIsActive  bit =null
   ,@pNoticeDate datetime
   ,@pProfileID		int
AS
BEGIN
	BEGIN TRY
       
    IF ISNULL(@pNotificationID,0) > 0
	BEGIN
	    IF  EXISTS (select 1 from [dbo].[tblNotification] (NoLock) where  IsDeleted = 0 and notificationID=@pNotificationID)
		BEGIN
		UPDATE [dbo].[tblNotification] 
	     SET  [notice] = @pNotice
			  ,[notificationType] = @pTypeID
			  ,[isRead] = 0
			--  ,[isActive] = @pIsActive
			  ,[isDeleted] = 0
			  ,[dateModified] = getDate()
			  ,[title] = @pTitle
			  ,[countryID] =@pCountryID
			  ,[cityID] = @pCityID
			  ,[groupID] = @pGroupID
			  ,[isGroupNotice] = 1
			  ,[noticeDate] = @pNoticeDate
			  ,[modifiedBy] = @pProfileID
	    WHERE notificationID=@pNotificationID

		Insert into tblLogTimeline
					(profileID,dateCreated,dateModified,isActive,isDeleted,description)
				    Values (@pProfileID,GETDATE(),GETDATE(),1,0,'Update Notification '+ @pTitle +' .')

	    select 1 as result;
		END
		ELSE
		BEGIN
		 select 5 as result;
		END
	END
	ELSE BEGIN
	     IF NOT EXISTS (select 1 from [dbo].[tblNotification] (NoLock) where  IsDeleted = 0 and notificationID=@pNotificationID)
		 BEGIN
		INSERT INTO [dbo].[tblNotification]
           ([notificationID]
           ,[notice]
           ,[notificationType]
           ,[isRead]
           ,[isActive]
           ,[isDeleted]
           ,[dateModified]
           ,[dateCreated]
           ,[title]
           ,[countryID]
           ,[cityID]
           ,[groupID]
           ,[isGroupNotice]
           ,[noticeDate]
           ,[modifiedBy])
     VALUES
           (Next Value for [dbo].[Seq_tblNotification] 
           ,@pNotice
           ,@pTypeID
           ,0
           ,0
           ,0
           ,getdate()
           ,getDate()
           ,@pTitle
           ,@pCountryID
           ,@pCityID
           ,@pGroupID
           ,1
           ,@pNoticeDate
           ,@pProfileID)

		 Insert into tblLogTimeline
				(profileID,dateCreated,dateModified,isActive,isDeleted,description)
				 Values (@pProfileID,GETDATE(),GETDATE(),1,0,'Added new food sub category '+ @pTitle +' .')
		 select 1 as result;
		END
		ELSE
		BEGIN
		 select 5 as result;
		END
	END
	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [dbo].[uspMarkCountryActive]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 20/03/2018
-- Description:Country


-- =============================================
CREATE PROCEDURE [dbo].[uspMarkCountryActive]
    @pCountryID	int	 
   ,@pProfileID		int
   ,@pIsActive		bit
AS
BEGIN
    DECLARE	@vActive nvarchar(max), 
			@vName nvarchar(max)

	set @vActive='active'	
	BEGIN TRY
    if(@pIsActive=0)
	begin
		set @vActive='inactive'		
	end
	   
    IF ISNULL(@pCountryID,0) > 0
	BEGIN
	    SELECT @vName=country from  [Lookup].[tblCountry] where countryID=@pCountryID

		UPDATE [Lookup].[tblCountry]
	    SET
		   isActive=@pIsActive
		  ,[dateModified] = GETDATE()
		  ,[modifiedBy] = @pProfileID
	    WHERE countryID=@pCountryID


		
		 Insert into tblLogTimeline
				(profileID,dateCreated,dateModified,isActive,isDeleted,description)
				 Values (@pProfileID,GETDATE(),GETDATE(),1,0,'Country  <b>'+ @vName +'</b> has been marked ' +@vActive +'.')
	END
	
	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [dbo].[uspMarkNoticeReadByID]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 12/07/2018
-- Description:	Notification
-- Exec [dbo].[uspMarkNoticeReadByID] 

-- =============================================
CREATE PROCEDURE [dbo].[uspMarkNoticeReadByID]
    @pReceiverID int
   ,@pIsSeller bit
AS
BEGIN
	BEGIN TRY
	  DECLARE @tblTempNotice table (ID int) 
	  DECLARE @tblUnReadGroupNotice table (ID int) 
	  DECLARE @tblReadGroupNotice table (ID int) 
	  DECLARE @vReadCount int,@vCountryID int=0,@vCityID int=0
	 
	 SELECT @vCountryID=countryID, @vCityID=cityID from profile.tblUserAddress where profileID=@pReceiverID and addressTypeID=4
	 IF EXISTS(SELECT * from profile.tblUserAddress where profileID=@pReceiverID and addressTypeID=4)
	 BEGIN
	  SELECT @vCountryID=countryID, @vCityID=cityID from profile.tblUserAddress where profileID=@pReceiverID and addressTypeID=4
	 END
	 ELSE IF EXISTS(SELECT * from profile.tblUserAddress where profileID=@pReceiverID and addressTypeID=2)
	 BEGIN
	  SELECT @vCountryID=countryID, @vCityID=cityID from profile.tblUserAddress where profileID=@pReceiverID and addressTypeID=2
	 END
	 ELSE
	 BEGIN
	   SELECT Top 1 @vCountryID=countryID, @vCityID=cityID from profile.tblUserAddress where profileID=@pReceiverID 
	 END
     --select * from Lookup.tblNotificationGroup
	  IF(@pIsSeller=1)
	  BEGIN
 	  INSERT INTO @tblTempNotice
	  SELECT [notificationID]
	  FROM [dbo].[tblNotification] as noti
	  WHERE  groupID in (1,4) and isGroupNotice=1 and ((noti.countryID <> null or noti.countryID <> 0) or noti.countryID = @vCountryID)
	  and ((noti.countryID <> null or noti.countryID <> 0) or noti.countryID = @vCityID)
	  END
	  ELSE 
	  BEGIN
 	  INSERT INTO @tblTempNotice
	  SELECT [notificationID]
	  FROM [dbo].[tblNotification] as noti
	  WHERE  groupID in (2,4) and isGroupNotice=1 and ((noti.countryID <> null or noti.countryID <> 0) or noti.countryID = @vCountryID)
	  and ((noti.countryID <> null or noti.countryID <> 0) or noti.countryID = @vCityID)
	  END


	  INSERT INTO @tblReadGroupNotice
	  SELECT [groupNotificationID]  
	  FROM [dbo].[tblNotificationReadStatus] as noti
	  WHERE  profileID=@pReceiverID and groupNotificationID in (select ID from  @tblTempNotice)


	  INSERT INTO @tblUnReadGroupNotice
	  SELECT ID
	  FROM  @tblTempNotice
	  WHERE  ID not in (select ID from  @tblReadGroupNotice)

       
	   UPDATE [dbo].[tblNotification]
	   SET [isRead]=1
	   WHERE receiverID=@pReceiverID and isSeller=@pIsSeller

	  
	  IF ((select count(*) from @tblUnReadGroupNotice) > 0)
	  BEGIN
			INSERT INTO [dbo].[tblNotificationReadStatus]
			   ([groupNotificateReadID]
			   ,[groupNotificationID]
			   ,[profileID]
			   ,[readDate]
			   ,[isActive]
			   ,[isDeleted])
			SELECT Next Value for [dbo].[Seq_tblNotificationReadStatus] 
			,ID
			,@pReceiverID
			,getDate()
			,1
			,0
			FROM @tblUnReadGroupNotice
			   
	
		END


	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [dbo].[uspMarkNotificationActive]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 12/07/2018
-- Description:	Product Deal
-- Exec  [dbo].[uspMarkNotificationActive]  1,1,1

-- =============================================
CREATE PROCEDURE  [dbo].[uspMarkNotificationActive] 
    @pNoticeID	int	 
   ,@pProfileID		int
   ,@pIsActive		bit
AS
BEGIN
    DECLARE	@vActive nvarchar(max), 
			@vName nvarchar(max)

	set @vActive='active'	
	BEGIN TRY
    if(@pIsActive=0)
	begin
		set @vActive='inactive'		
	end
	   
    IF ISNULL(@pNoticeID,0) > 0
	BEGIN
	    SELECT @vName=title from  [dbo].[tblNotification] where notificationID=@pNoticeID

		UPDATE [dbo].[tblNotification]
	    SET
		   isActive=@pIsActive
		  ,[dateModified] = GETDATE()
		  ,[modifiedBy] = @pProfileID
	    WHERE  notificationID=@pNoticeID


		
		 Insert into tblLogTimeline
				(profileID,dateCreated,dateModified,isActive,isDeleted,description)
				 Values (@pProfileID,GETDATE(),GETDATE(),1,0,'Marked Notice <b>'+ @vName +'</b> ' +@vActive +'.')
	END
	
	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [dbo].[uspMarkReadOrderNotification]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 12/07/2018
-- Description:	Notification
-- Exec [dbo].[uspInsertUpdateNotification] 

-- =============================================
CREATE PROCEDURE [dbo].[uspMarkReadOrderNotification]
   @pNoticeID int
AS
BEGIN
	BEGIN TRY
       
	   UPDATE [dbo].[tblNotification]
	   SET [isRead]=1
	   WHERE notificationID=@pNoticeID

	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [dbo].[uspPaymentStatus]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 20/03/2018
-- Description: 
-- Exec [dbo].[uspChangeContactUsStatus] 

-- =============================================
CREATE PROCEDURE [dbo].[uspPaymentStatus] 
    @pRequestID	int	 
   ,@pStatusID int

AS
BEGIN
   

	BEGIN TRY

    IF ISNULL(@pRequestID,0) > 0
	BEGIN
	 
		UPDATE [Product].[featureRequest]
	    SET
		   requestStatusID=@pStatusID
		  ,[dateModified] = GETDATE()
	    WHERE featureRequestID=@pRequestID


	END

	
	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [dbo].[uspUpdateCountry]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 12/07/2018
-- Description:	Country  Edit Record
-- Exec [dbo].[uspUpdateCountry]

-- =============================================
CREATE PROCEDURE [dbo].[uspUpdateCountry]

            @pCountryID	     int=null
		   ,@pProfileID		 int=null
		   ,@pCurrency			int=null
		   ,@pVat				nvarchar(250)=NULL
           ,@pCommisionValue	nvarchar(500)
           ,@pDistanceUnitID		  int =null
           ,@pIsHalal	  bit
           ,@pDateActivated		  datetime=null
		   ,@pModifiedby	  nvarchar(500)=null

AS
BEGIN
   DECLARE @vTitle nvarchar(250)
	BEGIN TRY
	  Select @vTitle=country from Lookup.tblCountry where countryID=@pCountryID
    IF ISNULL(@pCountryID,0) > 0
	BEGIN 

		   UPDATE [Lookup].[tblCountry]
		   SET [currency] =@pCurrency
			  ,[VAT] = @pVat
			  ,[commisionValue] = @pCommisionValue
			  ,[dateModified] = GETDATE()
			  ,[dateCreated] = GETDATE()
			  ,[distanceUnitID] = @pDistanceUnitID
			  ,[isHalal] = @pIsHalal
			  ,[dateActivated] = @pDateActivated
			  ,modifiedBy=@pModifiedby
		 WHERE countryID=@pCountryID



		Insert into tblLogTimeline
					(profileID,dateCreated,dateModified,isActive,isDeleted,description)
				    Values (@pProfileID,GETDATE(),GETDATE(),1,0,'Country : '+ @vTitle + 'Configuration has been Updated.')


	    select 1 as result;
	END
	END TRY
	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Lookup].[uspGetAddressType]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 10/04/2018
-- Description:	Profile seller by ID
-- Exec [Lookup].[uspGetAddressType]

-- =============================================
CREATE PROCEDURE [Lookup].[uspGetAddressType]
	  
AS
BEGIN
	BEGIN TRY

		SELECT [addressTypeID]
			  ,[addressType]
			  ,[isActive]
			  ,[isDeleted]
			  ,[dateModified]
			  ,[dateCreated]
		  FROM [Lookup].[tblAddressType]
		WHERE isDeleted=0 and isActive=1

	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Lookup].[uspGetAllAddOns]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 04/06/2018
-- Description:	Get All Add Ons
-- Exec [Lookup].[uspGetAllAddOns] 5

-- =============================================
CREATE PROCEDURE [Lookup].[uspGetAllAddOns]
	  @pSubCatID int	
AS
BEGIN
	BEGIN TRY

		SELECT 
		 aon.addOnID 
		,aop.optionID 
		,aon.title as title
		,aop.title as optionTitle
		,sub.name
		,price
		FROM  Lookup.tblAddOns as aon
		LEFT OUTER JOIN Lookup.tblAddOnOptions as aop ON aop.addOnID=aon.addOnID and aop.isActive=1 and aop.isDeleted=0
		LEFT OUTER JOIN Product.tblSubCategory as sub ON sub.subCategoryID=aon.subCatID
		WHERE aon.isDeleted=0 and aon.isActive=1 and aon.subCatID=@pSubCatID

	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Lookup].[uspGetAllBuyers]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 04/06/2018
-- Description:	Get All Buyer List
-- Exec [Lookup].[uspGetAllBuyers]

-- =============================================
CREATE PROCEDURE [Lookup].[uspGetAllBuyers]
	  
AS
BEGIN
	BEGIN TRY

		SELECT 
		       ps.profileID
			  ,email
			  ,username
			  ,firstName
			  ,lastName
			  ,email +'('+ firstName +' '+ lastName +')' fullName
			 -- ,FolderID
		FROM  Profile.tblUser as ps
		WHERE ps.isDeleted=0 and ps.isActive=1

	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Lookup].[uspGetAllCategories]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 10/04/2018
-- Description:	Get All Product Categories
-- Exec [Lookup].[uspGetAllCategories]

-- =============================================
CREATE PROCEDURE [Lookup].[uspGetAllCategories]
	  
AS
BEGIN
	BEGIN TRY

		SELECT [categoryID]
			  ,[name]
			  ,[isActive]
			  ,[isDeleted]
			  ,[dateModified]
			  ,[dateCreated]
		  FROM  Product.tblCategory
		WHERE isDeleted=0 and isActive=1

	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Lookup].[uspGetAllCity]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 10/04/2018
-- Description:	
-- Exec [Lookup].[uspGetAllCity]

-- =============================================
CREATE PROCEDURE [Lookup].[uspGetAllCity]
	  
AS
BEGIN
	BEGIN TRY

		SELECT [cityID]
			  ,[countryID]
			  ,[province]
			  ,[city]
			  ,[isActive]
			  ,[isDeleted]
			  ,[dateModified]
			  ,[dateCreated]
		  FROM [Lookup].[tblCity]
		WHERE isDeleted=0 and isActive=1

	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Lookup].[uspGetAllContactUsStatus]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 10/04/2018
-- Description:	
-- Exec [Lookup].[uspGetAllContactUsStatus]

-- =============================================
CREATE PROCEDURE [Lookup].[uspGetAllContactUsStatus]
	  
AS
BEGIN
	BEGIN TRY

		SELECT queryStatusID
		,title
		  FROM [Lookup].[tblContactUsStatus]
		WHERE isDeleted=0 and isActive=1

	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Lookup].[uspGetAllContactUsType]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 10/04/2018
-- Description:	
-- Exec [Lookup].[uspGetAllContactUsType]

-- =============================================
CREATE PROCEDURE [Lookup].[uspGetAllContactUsType]
	  
AS
BEGIN
	BEGIN TRY

		SELECT queryTypeID
		,title
		  FROM [Lookup].[tblContactUsType]
		WHERE isDeleted=0 and isActive=1

	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Lookup].[uspGetAllCountry]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 10/04/2018
-- Description:	
-- Exec [Lookup].[uspGetAllCountry]

-- =============================================
CREATE PROCEDURE [Lookup].[uspGetAllCountry]
	  
AS
BEGIN
	BEGIN TRY

		SELECT [countryID]
		  ,[country]
		  ,[currency]
		  ,[VAT]
		  ,[commisionValue]
		  ,[isActive]
		  ,[isDeleted]
		  ,[dateModified]
		  ,[dateCreated]
		FROM [Lookup].[tblCountry]
		WHERE isDeleted=0 and isActive=1

	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Lookup].[uspGetAllCurrencies]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 12/07/2018
-- Description:	
-- Exec [Lookup].[uspGetAllCurrencies]

-- =============================================
CREATE PROCEDURE [Lookup].[uspGetAllCurrencies]
	  
AS
BEGIN
	BEGIN TRY

			SELECT [currencyID]
			  ,[title]
			  ,[description] +' ('+ title +')' description
			  ,[isActive]
			  ,[isDeleted]
			  ,[dateModified]
			  ,[dateCreated]
			  ,[sign]
		  FROM [Lookup].[tblCurrency]
		WHERE isDeleted=0 and isActive=1

	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Lookup].[uspGetAllDistanceUnit]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 12/07/2018
-- Description:	
-- Exec [Lookup].[uspGetAllDistanceUnit]

-- =============================================
CREATE PROCEDURE [Lookup].[uspGetAllDistanceUnit]
	  
AS
BEGIN
	BEGIN TRY

			SELECT [unitID]
			  ,[unit]
			  ,[description] +' ('+ unit +')' as description
			  ,[isActive]
			  ,[isDeleted]
			  ,[dateModified]
			  ,[dateCreated]
		  FROM [Lookup].[tblDistanceUnit]
		WHERE isDeleted=0 and isActive=1

	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Lookup].[uspGetAllGender]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 10/04/2018
-- Description:	
-- Exec [Lookup].[uspGetAllGender]

-- =============================================
CREATE PROCEDURE [Lookup].[uspGetAllGender]
	  
AS
BEGIN
	BEGIN TRY

		SELECT [genderID]
		  ,[name]
		  ,[isActive]
		  ,[isDeleted]
		  ,[dateModified]
		  ,[dateCreated]
		FROM [Lookup].[tblGender]
		WHERE isDeleted=0 and isActive=1

	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Lookup].[uspGetAllMealType]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 04/06/2018
-- Description:	Get All Seller List
-- Exec [Lookup].[uspGetAllSellers]

-- =============================================
CREATE PROCEDURE [Lookup].[uspGetAllMealType]
	  
AS
BEGIN
	BEGIN TRY

		SELECT MealTypeID,name
		FROM  Lookup.tblMealType 
		WHERE isDeleted=0 and isActive=1

	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Lookup].[uspGetAllOrderStatus]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 04/06/2018
-- Description:	Get All Order Status List
-- Exec [Lookup].[uspGetAllOrderStatus]

-- =============================================
CREATE PROCEDURE [Lookup].[uspGetAllOrderStatus]
	  
AS
BEGIN
	BEGIN TRY

		SELECT orderStatusID,status
		FROM  Lookup.tblOrderStatus 
		WHERE isDeleted=0 and isActive=1

	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Lookup].[uspGetAllRatings]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 04/06/2018
-- Description:	Get All Order Ratings
-- Exec [Lookup].[uspGetAllRatings]

-- =============================================
CREATE PROCEDURE [Lookup].[uspGetAllRatings]
	  
AS
BEGIN
	BEGIN TRY

		SELECT ratingID,ratingNumber,description
		FROM  Lookup.tblRating 
		WHERE isDeleted=0 and isActive=1
		Order by 1 desc

	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Lookup].[uspGetAllRegistrationStatus]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 10/04/2018
-- Description:	
-- Exec [Lookup].[uspGetAllRegistrationStatus]

-- =============================================
CREATE PROCEDURE [Lookup].[uspGetAllRegistrationStatus]
	  
AS
BEGIN
	BEGIN TRY

		SELECT [registrationStatusID]
			  ,[registrationStatus]
			  ,[isActive]
			  ,[isDeleted]
			  ,[dateModified]
			  ,[dateCreated]
		  FROM [Lookup].[tblRegisterationStatus]
		WHERE isDeleted=0 and isActive=1

	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Lookup].[uspGetAllSellers]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 04/06/2018
-- Description:	Get All Seller List
-- Exec [Lookup].[uspGetAllSellers]

-- =============================================
CREATE PROCEDURE [Lookup].[uspGetAllSellers]
	  
AS
BEGIN
	BEGIN TRY

		SELECT sellerID
		      ,ps.profileID
			  ,email
			  ,username
			  ,firstName
			  ,lastName
			  ,displayTitle +'('+ firstName +' '+ lastName +')' displayTitle
			  ,FolderID
		FROM  Profile.tblSeller as ps
		inner join  Profile.tblUser as pu On pu.profileID=ps.profileID
		WHERE ps.isDeleted=0 and ps.isActive=1

	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Lookup].[uspGetAllSubCategories]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 04/06/2018
-- Description:	Get All Product Categories
-- Exec [Lookup].[uspGetAllSubCategories]

-- =============================================
CREATE PROCEDURE [Lookup].[uspGetAllSubCategories]
	  
AS
BEGIN
	BEGIN TRY

		SELECT [subCategoryID]
		      ,[categoryID]
			  ,[name]
			  ,[isActive]
			  ,[isDeleted]
			  ,[dateModified]
			  ,[dateCreated]
		  FROM  Product.tblSubCategory
		WHERE isDeleted=0 and isActive=1

	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Lookup].[uspGetAllTitles]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 10/04/2018
-- Description:	
-- Exec [Lookup].[uspGetAllTitles]

-- =============================================
CREATE PROCEDURE [Lookup].[uspGetAllTitles]
	  
AS
BEGIN
	BEGIN TRY

		SELECT [titleID]
			  ,[titleName]
			  ,[isActive]
			  ,[isDeleted]
			  ,[dateCreated]
			  ,[dateModified]
		  FROM [Lookup].[tblTitle]
		WHERE isDeleted=0 and isActive=1

	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Lookup].[uspGetAllUsernameEmail]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 10/04/2018
-- Description:	
-- Exec [Lookup].[uspGetAllUsernameEmail]

-- =============================================
CREATE PROCEDURE [Lookup].[uspGetAllUsernameEmail]
	  
AS
BEGIN
	BEGIN TRY

		SELECT username,email
		FROM [Profile].[tblUser]
		WHERE isDeleted=0 and isActive=1

	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Lookup].[uspGetAllUserRoles]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 10/04/2018
-- Description:	
-- Exec [Lookup].[uspGetAllUserRoles]

-- =============================================
CREATE PROCEDURE [Lookup].[uspGetAllUserRoles]
	  
AS
BEGIN
	BEGIN TRY

		SELECT [roleID]
			  ,[roleName]
			  ,[isActive]
			  ,[isDeleted]
			  ,[dateCreated]
			  ,[dateModified]
		  FROM [Lookup].[tblRole]
		WHERE isDeleted=0 and isActive=1

	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Lookup].[uspGetMartialStatus]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 10/04/2018
-- Description:	Profile seller by ID
-- Exec [Lookup].[uspGetMartialStatus]

-- =============================================
CREATE PROCEDURE [Lookup].[uspGetMartialStatus]
	  
AS
BEGIN
	BEGIN TRY

		SELECT [maritalStatusID]
			  ,[maritalStatusName]
			  ,[isActive]
			  ,[isDeleted]
			  ,[dateModified]
			  ,[dateCreated]
		FROM [Lookup].[tblMaritalStatus]
		WHERE isDeleted=0 and isActive=1

	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Lookup].[uspGetNotificationGroups]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 12/07/2018
-- Description:	Get All Notification Groups
-- Exec [Lookup].[uspGetNotificationGroups]

-- =============================================
CREATE PROCEDURE [Lookup].[uspGetNotificationGroups]
	  
AS
BEGIN
	BEGIN TRY

		SELECT notificationGroupID,title,description
		FROM  Lookup.tblNotificationGroup 
		WHERE isDeleted=0 and isActive=1

	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Lookup].[uspGetNotificationTypes]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 12/07/2018
-- Description:	Get All Notification Types
-- Exec [Lookup].[uspGetNotificationTypes]

-- =============================================
CREATE PROCEDURE [Lookup].[uspGetNotificationTypes]
	  
AS
BEGIN
	BEGIN TRY

		SELECT notificationTypeID,title,description
		FROM  Lookup.tblNotificationType 
		WHERE isDeleted=0 and isActive=1
		and notificationTypeID not in (2,4,5)

	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Product].[uspAddDeliveryAddress]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 04/06/2018
-- Description:	Product Meal
-- Exec [Product].[uspInsertUpdateMeal] null,'asdds','Baryani, Qorma, Palau',1
--select * from Product.tblOrder
--select * from Product.tblOrderItem
--select * from Lookup.tblOrderStatus
--select * from Product.tblOrderStatus
-- =============================================
CREATE PROCEDURE [Product].[uspAddDeliveryAddress]


	@pDeliveryAddress	nvarchar(max)=null
   ,@pComment		    nvarchar(max)=null
   ,@pPrice				nvarchar(250)=null	
  
	,@pOrderAddress		     as [Product].[AddressOrders] Readonly
     
AS
BEGIN
	BEGIN TRY
	           UPDATE [Product].[tblOrder]
			   SET comment=adrs.comment
			  -- ,price=adrs.price
			   ,deliveryAddress=@pDeliveryAddress
			   FROM @pOrderAddress as adrs
			   WHERE [Product].[tblOrder].orderID=adrs.orderID

		 select 1 as result;

	END TRY
	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Product].[uspDeleteCategory]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 20/03/2018
-- Description:	Product Category
-- Exec [Product].[uspDeleteCategory] 1,1


-- =============================================
CREATE PROCEDURE [Product].[uspDeleteCategory]
    @pCategoryID	int	 
   ,@pProfileID		int

AS
BEGIN
	BEGIN TRY
    DECLARE	@vName nvarchar(max)
	   
    IF ISNULL(@pCategoryID,0) > 0
	BEGIN
	    SELECT @vName=name from  [Product].[tblCategory] where categoryID=@pCategoryID

		UPDATE [Product].[tblCategory]
	    SET
		   isDeleted=1
		  ,[dateModified] = GETDATE()
		  ,[modifiedBy] = @pProfileID
	    WHERE categoryID=@pCategoryID


		
		 Insert into tblLogTimeline
				(profileID,dateCreated,dateModified,isActive,isDeleted,description)
				 Values (@pProfileID,GETDATE(),GETDATE(),1,0,'Delete a food category <b>'+ @vName +'</b>.')
	END
	
	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Product].[uspDeleteDeal]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 30/05/2018
-- Description:	Product Deal 
-- Exec [Product].[uspDeleteDeal] 1,1


-- =============================================
CREATE PROCEDURE [Product].[uspDeleteDeal]
    @pDealID	int	 
   ,@pProfileID		int

AS
BEGIN
	BEGIN TRY
    DECLARE	@vName nvarchar(max)
	   
    IF ISNULL(@pDealID,0) > 0
	BEGIN
	    SELECT @vName=title from  [Product].[tblDeal] where dealID=@pDealID

		UPDATE [Product].[tblDeal]
	    SET
		   isDeleted=1
		  ,[dateModified] = GETDATE()
		  ,[modifiedBy] = @pProfileID
	    WHERE dealID=@pDealID

		
		 Insert into tblLogTimeline
				(profileID,dateCreated,dateModified,isActive,isDeleted,description)
				 Values (@pProfileID,GETDATE(),GETDATE(),1,0,'Delete a deal <b>'+ @vName +'</b>.')
	END
	
	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Product].[uspDeleteFavourite]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 20/03/2018
-- Description:	Product Sub Category
-- Exec [Product].[uspDeleteFavourite] 1,1


-- =============================================
CREATE PROCEDURE [Product].[uspDeleteFavourite]
    @pfavID	int	 
  , @pProfileID int
AS
BEGIN
	BEGIN TRY
    DECLARE	@vName nvarchar(max)
	   
    IF ISNULL(@pfavID,0) > 0
	BEGIN
	   
		UPDATE [Profile].[tblUserFavourites]
	    SET
		   isDeleted=1
		  ,[dateModified] = GETDATE()
	    WHERE userfavouriteID=@pfavID


		
		 --Insert into tblLogTimeline
			--	(profileID,dateCreated,dateModified,isActive,isDeleted,description)
			--	 Values (@pProfileID,GETDATE(),GETDATE(),1,0,'Delete a food sub Category <b>'+ @vName +'</b>.')
	END
	
	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Product].[uspDeleteMealItem]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 30/05/2018
-- Description:	Product Meal Items
-- Exec [Product].[uspDeleteMealItem] 1,1


-- =============================================
CREATE PROCEDURE [Product].[uspDeleteMealItem]
    @pMealID	int	 
   ,@pProfileID		int

AS
BEGIN
	BEGIN TRY
    DECLARE	@vName nvarchar(max)
	   
    IF ISNULL(@pMealID,0) > 0
	BEGIN
	    SELECT @vName=title from  [Product].[tblMeal] where mealID=@pMealID

		UPDATE [Product].[tblMeal]
	    SET
		   isDeleted=1
		  ,[dateModified] = GETDATE()
		  ,[modifiedBy] = @pProfileID
	    WHERE mealID=@pMealID

		UPDATE [Product].[tblGallery]
	    SET
		   isDeleted=1
		  ,[dateModified] = GETDATE()
	    WHERE mealID=@pMealID

		UPDATE [Product].[tblMealTypes]
	    SET
		   isDeleted=1
		  ,[dateModified] = GETDATE()
	    WHERE mealID=@pMealID


		
		 Insert into tblLogTimeline
				(profileID,dateCreated,dateModified,isActive,isDeleted,description)
				 Values (@pProfileID,GETDATE(),GETDATE(),1,0,'Delete a meal item <b>'+ @vName +'</b>.')
	END
	
	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Product].[uspDeleteOrder]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 20/03/2018
-- Description:	Product Sub Category
-- Exec [Product].[uspDeleteSubCategory] 1,1


-- =============================================
CREATE PROCEDURE [Product].[uspDeleteOrder]
    @pOrderID		int	 
   ,@pProfileID		int

AS
BEGIN
	BEGIN TRY
    DECLARE	@vName nvarchar(max)
	   
    IF ISNULL(@pOrderID,0) > 0
	BEGIN
	   
		UPDATE [Product].[tblOrder]
	    SET
		   isDeleted=1
		  ,[dateModified] = GETDATE()
	    WHERE orderID=@pOrderID

		UPDATE [Product].[tblOrderItem]
	    SET
		   isDeleted=1
		  ,[dateModified] = GETDATE()
	    WHERE orderID=@pOrderID

		UPDATE [Product].[tblOrderStatus]
	    SET
		   isDeleted=1
		  ,[dateModified] = GETDATE()
	    WHERE orderID=@pOrderID

		UPDATE [Product].[tblOrderAddOns]
	    SET
		   isDeleted=1
		  ,[dateModified] = GETDATE()
	    WHERE orderItemID in (select orderItemID from product.tblOrderItem where orderID=@pOrderID)


		
	END
	
	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Product].[uspDeleteOrderItem]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 20/03/2018
-- Description:	Product Sub Category
-- Exec [Product].[uspDeleteSubCategory] 1,1


-- =============================================
CREATE PROCEDURE [Product].[uspDeleteOrderItem]
    @pOrderItemID		int	 
   ,@pProfileID		int

AS
BEGIN
	BEGIN TRY
    DECLARE	@vName nvarchar(max),@vOrderID int,@vOrderItemID int=0,@vSubtractedTotal int=0,@vNewTotal int=0 ,@vMealID int=0 ,@vDealID int=0 ,@vItemQuantity int=0 ,@vTotalPrice int=0

	SELECT @vOrderID=orderID,@vMealID=mealID,@vDealID=dealID FROM Product.tblOrderItem WHERE orderItemID=@pOrderItemID
	SELECT @vOrderItemID=orderItemID,@vItemQuantity=ISNULL(quantity,1) FROM Product.tblOrderItem WHERE orderItemID=@pOrderItemID and isDeleted=0

	   
    IF ISNULL(@vOrderItemID,0) > 0
	BEGIN

	    SELECT @vSubtractedTotal=ISNULL(SUM(aon.price),0)
		FROM [Product].[tblOrderAddOns] as ord
		LEFT OUTER JOIN lookup.tblAddOnOptions  as aon ON aon.optionID=ord.optionID 
		WHERE orderItemID = @pOrderItemID
		 
		 SELECT @vSubtractedTotal 'addONTOTAL'

		IF(ISNULL(@vMealID,0) > 0)
		BEGIN
		    
			SELECT @vTotalPrice=ISNULL(@vSubtractedTotal,0) + ISNULL(price,0) 
			FROM Product.tblMeal 
			WHERE mealID=@vMealID
			SET @vSubtractedTotal=ISNULL(@vTotalPrice,0) * ISNULL(@vItemQuantity,1)
		END
		ELSE
			BEGIN
			SELECT @vTotalPrice=ISNULL(@vSubtractedTotal,0) + ISNULL(price,0) 
			FROM Product.tblDeal 
			WHERE dealID=@vDealID
			SET @vSubtractedTotal=ISNULL(@vTotalPrice,0) * ISNULL(@vItemQuantity,1)
		END
		
		select @vTotalPrice as TotalPrice,@vItemQuantity as quantity,@vNewTotal as newTotal,@vSubtractedTotal as SubtractedTotal,price  as price FROM Product.tblOrder WHERE orderID=@vOrderID 

		SELECT @vNewTotal=price-@vSubtractedTotal FROM Product.tblOrder WHERE orderID=@vOrderID 

		select @vTotalPrice as TotalPrice,@vItemQuantity as quantity,@vNewTotal as newTotal,@vSubtractedTotal as SubtractedTotal,price  as price FROM Product.tblOrder WHERE orderID=@vOrderID 

		UPDATE [Product].[tblOrderItem]
	    SET isDeleted=1
		  ,[dateModified] = GETDATE()
	    WHERE orderItemID=@pOrderItemID



		UPDATE [Product].[tblOrderAddOns]
	    SET
		   isDeleted=1
		  ,[dateModified] = GETDATE()
	    WHERE orderItemID = @pOrderItemID


		UPDATE [Product].[tblOrder]
	    SET
		   quantity=quantity-1,
		   price=@vNewTotal
		  ,[dateModified] = GETDATE()
	    WHERE orderID=@vOrderID
		
	END
	
	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Product].[uspDeleteSubCategory]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 20/03/2018
-- Description:	Product Sub Category
-- Exec [Product].[uspDeleteSubCategory] 1,1


-- =============================================
CREATE PROCEDURE [Product].[uspDeleteSubCategory]
    @pSubCategoryID	int	 
   ,@pProfileID		int

AS
BEGIN
	BEGIN TRY
    DECLARE	@vName nvarchar(max)
	   
    IF ISNULL(@pSubCategoryID,0) > 0
	BEGIN
	    SELECT @vName=name from  [Product].[tblSubCategory] where subCategoryID=@pSubCategoryID

		UPDATE [Product].[tblSubCategory]
	    SET
		   isDeleted=1
		  ,[dateModified] = GETDATE()
		  ,[modifiedBy] = @pProfileID
	    WHERE subCategoryID=@pSubCategoryID


		
		 Insert into tblLogTimeline
				(profileID,dateCreated,dateModified,isActive,isDeleted,description)
				 Values (@pProfileID,GETDATE(),GETDATE(),1,0,'Delete a food sub Category <b>'+ @vName +'</b>.')
	END
	
	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Product].[uspGetAllClientOrders]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 20/03/2018
-- Description:	Product Order
-- Exec  [Product].[uspGetAllClientOrders] null,0,0,13,0,1,15,'orderID',1,null

-- =============================================
CREATE PROCEDURE [Product].[uspGetAllClientOrders]

				@pSearchText				NVARCHAR(500) =NULL,
				@pRatingID				   int =0,
				@pSellerID				   int =0,
				@pBuyerID				   int =0,
				@pOrderStatusID				int=0,
				@pPageNumber				INT = 1,
				@pPageSize					INT = 15,
				@pSortColumn     			NVARCHAR(250) = NULL,
				@pSortColumnIndex			TINYINT=0,
				@pOrderDate				    DateTime =NULL
				 
AS
BEGIN
	BEGIN TRY
	DECLARE		@Query			nvarchar(max),
				@vCriteria		nVarchar(Max),
				@vOrderBy		nvarchar(max),
				@vSortColumn	nvarchar(max),
				@curDate		date = getdate(),
				@vCriteria1		nVarchar(Max)

	IF (ISNULL(@pPageNumber,0) = 0) SET @pPageNumber=1  
	IF (ISNULL(@pPageSize,0) = 0)  SET @pPageSize=10  
		
	IF(@pSortColumnIndex < 1)  
		SET @vSortColumn = ' ASC'  
	ELSE  
		SET @vSortColumn = ' DESC'

	SET @vSortColumn = @pSortColumn + @vSortColumn
	Set @vCriteria	 = ' WHERE  ord.isDeleted=0 and ord.OrderLastStatusID <> 9'

    IF isnull(@pBuyerID,0 )<> 0 SET @vCriteria = @vCriteria + Char(13) + 'and ord.buyerProfileID = ' +  Cast(@pBuyerID as nvarchar(20)) 
	IF isnull(@pSellerID,0 )<> 0 SET @vCriteria = @vCriteria + Char(13) + 'and ord.sellerProfileID = '+  Cast(@pSellerID as nvarchar(20)) 
	IF isnull(@pRatingID,0 )<> 0 SET @vCriteria = @vCriteria + Char(13) + 'and ord.ratingID = '+  Cast(@pRatingID as nvarchar(20)) 
	IF isnull(@pOrderStatusID,0 )<> 0 SET @vCriteria = @vCriteria + Char(13) + 'and ord.OrderLastStatusID = '+  Cast(@pOrderStatusID as nvarchar(20))

	IF isnull(@pSearchText,'' )<> '' SET @vCriteria = @vCriteria + Char(13) + 'and (sel.displayTitle like ''%' + @pSearchText + '%'' OR pro.firstName like ''%' + @pSearchText + '%'' OR pro.lastName like ''%' + @pSearchText + '%'')'
	
	IF isnull(@pOrderDate,0 )<> 0 SET @vCriteria = @vCriteria + Char(13) + 'and CONVERT(date, ord.orderDate)= '''+  Cast(CONVERT(date, @pOrderDate) as nvarchar(20)) +''''
	


	SET @vOrderBy =' ORDER BY	1'+/*@vSortColumn*/+Char(13)
	SET @vOrderBy =@vOrderBy+ ' OFFSET ( '+Cast(@pPageSize as nvarchar(20)) +'* ( '+Cast(@pPageNumber as nvarchar(20))+'-1)) ROWS'+Char(13)
	SET @vOrderBy =@vOrderBy+  ' FETCH NEXT '+ Cast(@pPageSize as nvarchar(20)) +' ROWS ONLY	'+Char(13)

	SET @Query = ' SELECT Row_number() over (order by ' + @vSortColumn+' ) as RowNum		
      ,ord.[orderID]
      ,ord.[sellerProfileID]
      ,ord.[buyerProfileID]
	  ,sel.displayTitle
	  ,sel.FolderID
	  ,pro.firstName +'' ''+ pro.lastName  seller
	  ,buy.firstName +'' ''+ buy.lastName  buyer
	  ,ord.deliveryDate
	  ,CONVERT(date, ord.orderDate) as orderDate
	  -- ,ord.orderDate 
      ,ord.deliveryAddress
      ,ord.[quantity]
      ,ISNULL(ord.[ratingID],1) as ratingID
      ,ISNULL(rat.[ratingNumber],0) as rating
      ,ord.[comment]
      ,ord.[orderLastStatusID]
      ,status.[status]
      ,ord.[price]
      ,ord.[paymentDone]
	  ,ord.recieptNumber
      ,ord.[isActive]
      ,ord.[isDeleted]
	  ,Count(1) over()	AS TotalRecords 
	  FROM [Product].[tblOrder] as ord
	  Inner join [Profile].[tblSeller] as sel ON sel.profileID=ord.sellerProfileID
      Inner join [Profile].[tblUser] as pro ON pro.profileID=ord.sellerProfileID
	  Inner join [Profile].[tblUser] as buy ON buy.profileID=ord.buyerProfileID
	   LEFT OUTER join  [Lookup].[tblRating] as rat ON rat.ratingID=ord.ratingID
	  LEFT OUTER join [Lookup].[tblOrderStatus] as status ON status.orderStatusID=ord.orderLastStatusID 
	'+ +Char(13)+@vCriteria+@vOrderBy
	
	Print substring(@Query , 0 , 4000)
	Exec sp_executesql @Query

	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Product].[uspGetAllFavourits]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 25/06/2018
-- Description:	Meal items By seller ID
-- EXEC [Product].[uspGetAllFavourits] '',13,1,10,'userfavouriteID',1
-- SELECT TOP 5 * FROM tblLogDBError order by 1 DESC

-- =============================================
CREATE PROCEDURE [Product].[uspGetAllFavourits]

				@pSearchText				NVARCHAR(500) =NULL,
				@pBuyerID				    int =0,
				@pPageNumber				INT = 1,
				@pPageSize					INT = 15,
				@pSortColumn     			NVARCHAR(250) = NULL,
				@pSortColumnIndex			TINYINT=0

AS
BEGIN
	BEGIN TRY
	DECLARE		@Query			nvarchar(max),
				@vCriteria		nVarchar(Max),
				@vOrderBy		nvarchar(max),
				@vSortColumn	nvarchar(max),
				@curDate		date = getdate(),
				@vCriteria1		nVarchar(Max)

	IF (ISNULL(@pPageNumber,0) = 0) SET @pPageNumber=1  
	IF (ISNULL(@pPageSize,0) = 0)  SET @pPageSize=10  
		
	IF(@pSortColumnIndex < 1)  
		SET @vSortColumn = ' ASC'  
	ELSE  
		SET @vSortColumn = ' DESC'

	SET @vSortColumn = @pSortColumn + @vSortColumn
	Set @vCriteria	 = ' WHERE  pu.isDeleted=0  and uf.buyerProfileID = '+ CAST(@pBuyerID as nvarchar(30))+ ''
	IF isnull(@pSearchText,'')<>'' SET @vCriteria = @vCriteria + Char(13) + 'and ps.displayTitle like ''%' + @pSearchText + '%'''
   -- IF isnull(@pSellerID,0 )<> 0 SET @vCriteria = @vCriteria + Char(13) + 'and sel.profileID = ' +  Cast(@pSellerID as nvarchar(20)) 

	SET @vOrderBy =' ORDER BY	1'+/*@vSortColumn*/+Char(13)
	SET @vOrderBy =@vOrderBy+ ' OFFSET ( '+Cast(@pPageSize as nvarchar(20)) +'* ( '+Cast(@pPageNumber as nvarchar(20))+'-1)) ROWS'+Char(13)
	SET @vOrderBy =@vOrderBy+  ' FETCH NEXT '+ Cast(@pPageSize as nvarchar(20)) +' ROWS ONLY	'+Char(13)

	SET @Query = ' SELECT Row_number() over (order by ' + @vSortColumn+' ) as RowNum,		
     [userfavouriteID]
      ,[sellerProfileID]
	  ,[firstName]+'' ''+[lastName] as ''seller''
	  ,[displayTitle] as ''title''
      ,[buyerProfileID]
	  ,ISNULL(ps.logo,ps.bannarPhoto) as logo
	  ,ISNULL(ps.description,'''') as description
	  ,ISNULL(ps.avgrating,0) as rating
      ,uf.[isActive]
      ,uf.[isDeleted]
      ,uf.[dateModified]
      ,uf.[dateCreated]
	  ,Count(1) over()	AS TotalRecords 
	  FROM [Profile].[tblUserFavourites] as uf
   inner join [Profile].[tblUser] (NOLOCK) as pu ON pu.profileID = uf.sellerProfileID
   inner join [Profile].[tblSeller] (NOLOCK) as ps ON ps.profileID = uf.sellerProfileID'+ +Char(13)+@vCriteria+@vOrderBy
	
	Print substring(@Query , 0 , 4000)
	Exec sp_executesql @Query

	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Product].[uspGetAllOrders]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 20/03/2018
-- Description:	Product Order
-- Exec  [Product].[uspGetAllOrders] null,0,0,13,0,1,15,'orderID',1,null

-- =============================================
CREATE PROCEDURE [Product].[uspGetAllOrders]

				@pSearchText				NVARCHAR(500) =NULL,
				@pRatingID				   int =0,
				@pSellerID				   int =0,
				@pBuyerID				   int =0,
				@pOrderStatusID				int=0,
				@pPageNumber				INT = 1,
				@pPageSize					INT = 15,
				@pSortColumn     			NVARCHAR(250) = NULL,
				@pSortColumnIndex			TINYINT=0,
				@pOrderDate				    DateTime =NULL
				 
AS
BEGIN
	BEGIN TRY
	DECLARE		@Query			nvarchar(max),
				@vCriteria		nVarchar(Max),
				@vOrderBy		nvarchar(max),
				@vSortColumn	nvarchar(max),
				@curDate		date = getdate(),
				@vCriteria1		nVarchar(Max)

	IF (ISNULL(@pPageNumber,0) = 0) SET @pPageNumber=1  
	IF (ISNULL(@pPageSize,0) = 0)  SET @pPageSize=10  
		
	IF(@pSortColumnIndex < 1)  
		SET @vSortColumn = ' ASC'  
	ELSE  
		SET @vSortColumn = ' DESC'

	SET @vSortColumn = @pSortColumn + @vSortColumn
	Set @vCriteria	 = ' WHERE  ord.isDeleted=0 '

    IF isnull(@pBuyerID,0 )<> 0 SET @vCriteria = @vCriteria + Char(13) + 'and ord.buyerProfileID = ' +  Cast(@pBuyerID as nvarchar(20)) 
	IF isnull(@pSellerID,0 )<> 0 SET @vCriteria = @vCriteria + Char(13) + 'and ord.sellerProfileID = '+  Cast(@pSellerID as nvarchar(20)) 
	IF isnull(@pRatingID,0 )<> 0 SET @vCriteria = @vCriteria + Char(13) + 'and ord.ratingID = '+  Cast(@pRatingID as nvarchar(20)) 
	IF isnull(@pOrderStatusID,0 )<> 0 SET @vCriteria = @vCriteria + Char(13) + 'and ord.OrderLastStatusID = '+  Cast(@pOrderStatusID as nvarchar(20))

	IF isnull(@pSearchText,'' )<> '' SET @vCriteria = @vCriteria + Char(13) + 'and (sel.displayTitle like ''%' + @pSearchText + '%'' OR pro.firstName like ''%' + @pSearchText + '%'' OR pro.lastName like ''%' + @pSearchText + '%'')'
	
	IF isnull(@pOrderDate,0 )<> 0 SET @vCriteria = @vCriteria + Char(13) + 'and CONVERT(date, ord.orderDate)= '''+  Cast(CONVERT(date, @pOrderDate) as nvarchar(20)) +''''
	


	SET @vOrderBy =' ORDER BY	1'+/*@vSortColumn*/+Char(13)
	SET @vOrderBy =@vOrderBy+ ' OFFSET ( '+Cast(@pPageSize as nvarchar(20)) +'* ( '+Cast(@pPageNumber as nvarchar(20))+'-1)) ROWS'+Char(13)
	SET @vOrderBy =@vOrderBy+  ' FETCH NEXT '+ Cast(@pPageSize as nvarchar(20)) +' ROWS ONLY	'+Char(13)

	SET @Query = ' SELECT Row_number() over (order by ' + @vSortColumn+' ) as RowNum		
      ,ord.[orderID]
      ,ord.[sellerProfileID]
      ,ord.[buyerProfileID]
	  ,sel.displayTitle
	  ,sel.FolderID
	  ,pro.firstName +'' ''+ pro.lastName  seller
	  ,buy.firstName +'' ''+ buy.lastName  buyer
	  ,ord.deliveryDate
	  ,CONVERT(date, ord.orderDate) as orderDate
	  -- ,ord.orderDate 
      ,ord.deliveryAddress
      ,ord.[quantity]
      ,ord.[ratingID]
      ,rat.[description] as rating
      ,ord.[comment]
      ,ord.[orderLastStatusID]
      ,status.[status]
      ,ord.[price]
      ,ord.[paymentDone]
	  ,ord.recieptNumber
      ,ord.[isActive]
      ,ord.[isDeleted]
	  ,Count(1) over()	AS TotalRecords 
	  FROM [Product].[tblOrder] as ord
	  Inner join [Profile].[tblSeller] as sel ON sel.profileID=ord.sellerProfileID
      Inner join [Profile].[tblUser] as pro ON pro.profileID=ord.sellerProfileID
	  Inner join [Profile].[tblUser] as buy ON buy.profileID=ord.buyerProfileID
	   LEFT OUTER join  [Lookup].[tblRating] as rat ON rat.ratingID=ord.ratingID
	  LEFT OUTER join [Lookup].[tblOrderStatus] as status ON status.orderStatusID=ord.orderLastStatusID 
	'+ +Char(13)+@vCriteria+@vOrderBy
	
	Print substring(@Query , 0 , 4000)
	Exec sp_executesql @Query

	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Product].[uspGetAllSellerDeals]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 26/06/2018
-- Description:	Product Deal
-- Exec  [Product].[uspGetAllSellerDeals] null,0,1,15,'Title',1

-- =============================================
CREATE PROCEDURE [Product].[uspGetAllSellerDeals]

				@pSearchText				NVARCHAR(500) =NULL,
				@pSellerID				   int =0,
				@pPageNumber				INT = 1,
				@pPageSize					INT = 15,
				@pSortColumn     			NVARCHAR(250) = NULL,
				@pSortColumnIndex			TINYINT=0

				 
AS
BEGIN
	BEGIN TRY
	DECLARE		@Query			nvarchar(max),
				@vCriteria		nVarchar(Max),
				@vOrderBy		nvarchar(max),
				@vSortColumn	nvarchar(max),
				@curDate		date = getdate(),
				@vCriteria1		nVarchar(Max)

	IF (ISNULL(@pPageNumber,0) = 0) SET @pPageNumber=1  
	IF (ISNULL(@pPageSize,0) = 0)  SET @pPageSize=10  
		
	IF(@pSortColumnIndex < 1)  
		SET @vSortColumn = ' ASC'  
	ELSE  
		SET @vSortColumn = ' DESC'

	SET @vSortColumn = @pSortColumn + @vSortColumn
	Set @vCriteria	 = ' WHERE  deal.isDeleted=0 '
	IF isnull(@pSearchText,'')<>'' SET @vCriteria = @vCriteria + Char(13) + 'and title like ''%' + @pSearchText + '%'''	
	IF isnull(@pSellerID,0 )<> 0 SET @vCriteria = @vCriteria + Char(13) + 'and sel.profileID = '+  Cast(@pSellerID as nvarchar(20)) 
	
	
	SET @vOrderBy =' ORDER BY	1'+/*@vSortColumn*/+Char(13)
	SET @vOrderBy =@vOrderBy+ ' OFFSET ( '+Cast(@pPageSize as nvarchar(20)) +'* ( '+Cast(@pPageNumber as nvarchar(20))+'-1)) ROWS'+Char(13)
	SET @vOrderBy =@vOrderBy+  ' FETCH NEXT '+ Cast(@pPageSize as nvarchar(20)) +' ROWS ONLY	'+Char(13)

	SET @Query = '  SELECT Row_number() over (order by ' + @vSortColumn+' ) as RowNum,		
      [dealID]
      ,deal.[profileID]
      ,deal.[title]
      ,deal.[description]
      ,deal.[photo]
      ,deal.[serving]
      ,deal.[isFeatured]
      ,deal.[price]
      ,deal.[isActive]
      ,deal.[isDeleted]
      ,deal.[dateCreated]
	  ,sel.FolderID as folderID
	  ,sel.displayTitle
	  ,pro.firstName +'' ''+ pro.lastName  fullName
	  ,sel.FolderID
	  ,Count(1) over()	AS TotalRecords 
	  FROM [Product].[tblDeal] as deal
	  Inner join [Profile].[tblSeller] as sel ON sel.profileID=deal.profileID
      Inner join [Profile].tblUser as pro ON pro.profileID=deal.profileID'+ +Char(13)+@vCriteria+@vOrderBy
	
	Print substring(@Query , 0 , 4000)
	Exec sp_executesql @Query

	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Product].[uspGetAllSellerMeals]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 25/06/2018
-- Description:	Meal items By seller ID
--  Exec [Product].[uspGetAllSellerMeals] '',0,1,15,'Title',1

-- =============================================
CREATE PROCEDURE [Product].[uspGetAllSellerMeals]

				@pSearchText				NVARCHAR(500) =NULL,
				@pSellerID				   int =0,
				@pPageNumber				INT = 1,
				@pPageSize					INT = 15,
				@pSortColumn     			NVARCHAR(250) = NULL,
				@pSortColumnIndex			TINYINT=0

AS
BEGIN
	BEGIN TRY
	DECLARE		@Query			nvarchar(max),
				@vCriteria		nVarchar(Max),
				@vOrderBy		nvarchar(max),
				@vSortColumn	nvarchar(max),
				@curDate		date = getdate(),
				@vCriteria1		nVarchar(Max)

	IF (ISNULL(@pPageNumber,0) = 0) SET @pPageNumber=1  
	IF (ISNULL(@pPageSize,0) = 0)  SET @pPageSize=10  
		
	IF(@pSortColumnIndex < 1)  
		SET @vSortColumn = ' ASC'  
	ELSE  
		SET @vSortColumn = ' DESC'

	SET @vSortColumn = @pSortColumn + @vSortColumn
	Set @vCriteria	 = ' WHERE  meal.isDeleted=0 '
	IF isnull(@pSearchText,'')<>'' SET @vCriteria = @vCriteria + Char(13) + 'and title like ''%' + @pSearchText + '%'''
    IF isnull(@pSellerID,0 )<> 0 SET @vCriteria = @vCriteria + Char(13) + 'and sel.profileID = ' +  Cast(@pSellerID as nvarchar(20)) 

	SET @vOrderBy =' ORDER BY	1'+/*@vSortColumn*/+Char(13)
	SET @vOrderBy =@vOrderBy+ ' OFFSET ( '+Cast(@pPageSize as nvarchar(20)) +'* ( '+Cast(@pPageNumber as nvarchar(20))+'-1)) ROWS'+Char(13)
	SET @vOrderBy =@vOrderBy+  ' FETCH NEXT '+ Cast(@pPageSize as nvarchar(20)) +' ROWS ONLY	'+Char(13)

	SET @Query = ' SELECT Row_number() over (order by ' + @vSortColumn+' ) as RowNum,		
      [mealID]
      ,meal.[profileID]
      ,meal.[subCategoryID]
	  ,sub.[name] subCategory
	  ,cat.[name] category
      ,meal.[categoryID]
      ,meal.[title]
      ,meal.[description]
      ,meal.[photo]
      ,meal.[serving]
      ,meal.[isSpeciality]
      ,meal.[isFeature]
      ,meal.[price]
      --,meal.[mealTypeID]
	--  ,mtype.[name] mealType
      ,meal.[isActive]
      ,meal.[isDeleted]
      ,meal.[dateCreated]
	  ,sel.displayTitle
	  ,pro.firstName +'' ''+ pro.lastName  fullName
	  ,sel.FolderID
	  ,Count(1) over()	AS TotalRecords 
	  FROM [Product].[tblMeal] as meal
	  Inner join [Product].[tblCategory] as cat ON cat.categoryID=meal.categoryID
	  Inner join [Product].[tblSubCategory] as sub ON sub.subCategoryID=meal.subCategoryID
	  --Inner join [Lookup].[tblMealType] as mtype ON mtype.mealTypeID=meal.mealTypeID 
	  Inner join [Profile].[tblSeller] as sel ON sel.profileID=meal.profileID
      Inner join [Profile].tblUser as pro ON pro.profileID=meal.profileID'+ +Char(13)+@vCriteria+@vOrderBy
	
	--Print substring(@Query , 0 , 4000)
	Exec sp_executesql @Query

	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Product].[uspGetBuyerCheckOutOrders]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 4/06/2018
-- Description:	Order By ID
-- Exec [Product].[uspGetBuyerCheckOutOrders] 13

-- =============================================
CREATE PROCEDURE [Product].[uspGetBuyerCheckOutOrders]
				@pBuyerID int	
			   ,@pOrderDate dateTime=null	 
AS
BEGIN
	BEGIN TRY
			   SELECT distinct	
				   ord.[orderID]
				  ,ord.[sellerProfileID]
				  ,ord.[buyerProfileID]
				  ,sel.displayTitle
				  ,sel.FolderID
				  ,pro.firstName +' '+ pro.lastName  seller
				  ,ord.deliveryDate
				  ,ord.orderDate
				  ,ord.deliveryAddress
				  ,ord.[quantity]
				  ,ord.[ratingID]
				  ,rat.[description]
				  ,ord.[comment]
				  ,ord.[orderLastStatusID]
				  ,[stat].[status]
				  ,ord.[price]
				  ,ord.[paymentDone]
				  ,ord.recieptNumber
				  ,ord.[isActive]
				  ,ord.[isDeleted]
				  ,Count(1) over()	AS TotalRecords 
				  FROM [Product].[tblOrder] as ord
				  Inner join [Profile].[tblSeller] as sel ON sel.profileID=ord.sellerProfileID
				  Inner join [Profile].[tblUser] as pro ON pro.profileID=ord.sellerProfileID
				   Inner join [Product].[tblOrderItem] as item  ON item.orderID=ord.orderID
				  left outer  join Profile.tblUserAddress as pua ON pua.profileID=ord.sellerProfileID
				 left outer  join Lookup.tblCountry as cty ON cty.countryID=pua.countryID
				 left outer  join Lookup.tblCurrency as cur ON cur.currencyID=cty.currency
				  left outer  join [Lookup].[tblRating] as rat ON rat.ratingID=ord.ratingID
				  left outer  join [Lookup].[tblOrderStatus] as stat ON stat.orderStatusID= ord.orderLastStatusID
			 WHERE  ord.buyerProfileID=@pBuyerID  and ord.isDeleted=0 and ord.isActive=1 and ord.orderLastStatusID=9     
 
 SELECT item.orderID
 ,item.orderItemID
 ,item.mealID
 ,item.quantity 
 ,CASE WHEN ISNULL(meal.mealID,0)=0 THEN deal.price ELSE meal.price END as price
 ,CASE WHEN ISNULL(meal.mealID,0)=0  THEN deal.photo ELSE meal.photo END as photo    
 ,CASE WHEN ISNULL(meal.mealID,0)=0  THEN deal.title ELSE meal.title END as title
 ,CASE WHEN ISNULL(meal.mealID,0)=0  THEN 1 ELSE 0 END  as isDeal
 ,item.comment 
 into #tempOrder
 FROM Product.tblOrder as Odr
 left outer join [Product].[tblOrderItem] as item  ON Odr.orderID=item.orderID
 left outer join [Product].[tblMeal] as meal ON meal.mealID=item.mealID
 left outer join [Product].[tblDeal] as Deal ON deal.dealID=item.dealID
 WHERE odr.buyerProfileID=@pBuyerID and odr.isDeleted=0  and item.isDeleted=0 and item.isActive=1 and odr.isActive=1 and odr.orderLastStatusID=9


 SELECT 
 aon.optionID,
 opt.price,
 opt.title,
 orderItemID
 FROM Product.tblOrderAddOns as aon
 LEFT OUTER JOIN Lookup.tblAddOnOptions as opt ON opt.optionID=aon.optionID
 WHERE aon.orderItemID in( select orderItemID from #tempOrder) and aon.isDeleted=0 and aon.isActive=1 


 
 SELECT *  from #tempOrder

 drop table #tempOrder


 END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Product].[uspGetBuyerIncompleteOrder]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 4/06/2018
-- Description:	Order By ID
-- Exec [Product].[uspGetBuyerIncompleteOrder] 13,12
--select * from product.tblDeal 


-- =============================================
CREATE PROCEDURE [Product].[uspGetBuyerIncompleteOrder]
				@pBuyerID int	
			   ,@pSellerID int
			   ,@pOrderDate dateTime=null	 
AS
BEGIN
	BEGIN TRY
    
	 SELECT item.orderID
		,item.orderItemID
		,item.mealID
		,item.dealID
		,item.quantity 
		,Odr.quantity as totalQuantity
		,Odr.price as totalPrice
		,item.comment 
	 INTO #tempOrders
	 FROM Product.tblOrder as Odr
	 left outer join [Product].[tblOrderItem] as item  ON Odr.orderID=item.orderID
	 WHERE  odr.sellerProfileID=@pSellerID and odr.buyerProfileID=@pBuyerID and odr.isDeleted=0 and odr.isActive=1 and odr.orderLastStatusID=9   and item.isDeleted=0 and item.isActive=1

	 Select orderItemID,aon.optionID,price
	 INTO #tempAddOns
	 from [Product].[tblOrderAddOns] as aon
	 Inner join Lookup.tblAddOnOptions lop ON lop.optionID=aon.optionID
	 WHERE orderItemID in (select orderItemID from #tempOrders)

	 SELECT 
		 ord.orderID
		,ord.orderItemID
		,ord.mealID
		,ord.dealID
		,ord.quantity 
		,ord.totalQuantity
		,ord.totalPrice
		,ord.comment 
		,deal.price dealCost
	 ,CASE WHEN ISNULL(meal.mealID,0)=0  THEN deal.price ELSE meal.price END as price
	 ,CASE WHEN ISNULL(meal.mealID,0)=0  THEN deal.photo ELSE meal.photo END as photo    
	 ,CASE WHEN ISNULL(meal.mealID,0)=0  THEN deal.title ELSE meal.title END as title
	 ,CASE WHEN ISNULL(meal.mealID,0)=0  THEN 1 ELSE 0 END  as isDeal
	 ,(SELECT sum(price) from #tempAddOns as tao WHERE tao.orderItemID=ord.orderItemID) as sumprice
	 INTO #tempResult
	 FROM  #tempOrders as ord
	 left outer join [Product].[tblMeal] as meal ON meal.mealID=ord.mealID
	 left outer join [Product].[tblDeal] as Deal ON deal.dealID=ord.dealID


	 SELECT  orderID
		,orderItemID
		,photo
		,title
		,mealID
		,dealID
		,isDeal
		,quantity 
		,totalQuantity
		,comment  
		,totalPrice
		,CASE WHEN (isDeal=0)  THEN price +  isnull(sumprice,0) ELSE dealCost END as price
		,dealCost  
		,sumprice
		--,price + isnull(sumprice,0) as price
	FROM #tempResult

	drop table #tempResult
		drop table #tempOrders
			drop table #tempAddOns
 END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Product].[uspGetCategories]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 20/03/2018
-- Description:	Product Category
-- Exec [Product].[uspGetCategories] 'MachineSignature-001','::1','admin','CgumbG+yQieUWyDi3nSrhZdrPHpDthzDOl4eQkP3rK0='

-- =============================================
CREATE PROCEDURE [Product].[uspGetCategories]

				@pSearchText				NVARCHAR(500),
				@pPageNumber				INT = 1,
				@pPageSize					INT = 15,
				@pSortColumn     			NVARCHAR(250) = NULL,
				@pSortColumnIndex			TINYINT=0
				 
AS
BEGIN
	BEGIN TRY
	DECLARE		@Query			nvarchar(max),
				@vCriteria		nVarchar(Max),
				@vOrderBy		nvarchar(max),
				@vSortColumn	nvarchar(max),
				@curDate		date = getdate(),
				@vCriteria1		nVarchar(Max)

	IF (ISNULL(@pPageNumber,0) = 0) SET @pPageNumber=1  
	IF (ISNULL(@pPageSize,0) = 0)  SET @pPageSize=10  
		
	IF(@pSortColumnIndex < 1)  
		SET @vSortColumn = ' ASC'  
	ELSE  
		SET @vSortColumn = ' DESC'

	SET @vSortColumn = @pSortColumn + @vSortColumn
	Set @vCriteria	 = ' WHERE isDeleted=0 '
	IF isnull(@pSearchText,'')<>'' SET @vCriteria = @vCriteria + Char(13) + 'and name like ''%' + @pSearchText + '%'''


	SET @vOrderBy =' ORDER BY	1'+/*@vSortColumn*/+Char(13)
	SET @vOrderBy =@vOrderBy+ ' OFFSET ( '+Cast(@pPageSize as nvarchar(20)) +'* ( '+Cast(@pPageNumber as nvarchar(20))+'-1)) ROWS'+Char(13)
	SET @vOrderBy =@vOrderBy+  ' FETCH NEXT '+ Cast(@pPageSize as nvarchar(20)) +' ROWS ONLY	'+Char(13)

	SET @Query = ' SELECT Row_number() over (order by ' + @vSortColumn+' ) as RowNum,		
	   [categoryID]
      ,[name]
      ,[description]
      ,[isActive]
      ,[isDeleted]
      ,[dateModified]
      ,[dateCreated]
	  ,Count(1) over()	AS TotalRecords 
	FROM [Product].[tblCategory]'++Char(13)+@vCriteria+@vOrderBy
	
	Print substring(@Query , 0 , 4000)
	Exec sp_executesql @Query

	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Product].[uspGetCategoryByID]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 20/03/2018
-- Description:	Product Category
-- Exec [Product].[uspGetCategoryByID] 1

-- =============================================
CREATE PROCEDURE [Product].[uspGetCategoryByID]

				@pCategoryID int	 
AS
BEGIN
	BEGIN TRY
       
	   SELECT 	
	   [categoryID]
      ,[name]
      ,[description]
      ,[isActive]
      ,[isDeleted]
      ,[dateModified]
      ,[dateCreated]
	FROM [Product].[tblCategory]
	WHERE categoryID=@pCategoryID

	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Product].[uspGetDealByID]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 25/06/2018
-- Description:	deal By ID
-- Exec [Product].[uspGetDealByID] 1

-- =============================================
CREATE PROCEDURE [Product].[uspGetDealByID]

				@pDealID int	 
AS
BEGIN
	BEGIN TRY
       
	SELECT  [dealID]
      ,deal.[profileID]
      ,deal.[title]
      ,deal.[description]
      ,deal.[photo] as 'Photo'
      ,deal.[serving]
      ,deal.[isFeatured]
      ,deal.[price]
      ,deal.[isActive]
      ,deal.[isDeleted]
      ,deal.[dateCreated]
	  ,sel.displayTitle
	  ,pro.firstName +' '+ pro.lastName  fullName
	  ,sel.FolderID
	  ,cty.currency as currencyID
		,cur.sign as currency
	  ,(select count(*) from Product.tblDeal where isDeleted=0) as TotalRecords
	  FROM [Product].[tblDeal] as deal
	  Inner join [Profile].[tblSeller] as sel ON sel.profileID=deal.profileID
      Inner join [Profile].tblUser as pro ON pro.profileID=deal.profileID
	  left outer  join Profile.tblUserAddress as pua ON pua.profileID=pro.profileID and pua.addressTypeID=4 and pua.isActive=1 and pua.isDeleted=0
	 left outer  join Lookup.tblCountry as cty ON cty.countryID=pua.countryID
	 inner join Lookup.tblCurrency as cur ON cur.currencyID=cty.currency
  Where [dealID]=@pDealID

  	SELECT  [itemID]
	  ,deal.dealID
	  ,deal.mealID
	  ,meal.title
	  ,meal.price
	  ,meal.description
	  ,meal.serving
      ,deal.[isActive]
      ,deal.[isDeleted]
      ,deal.[dateCreated]
	  ,(select count(*) from Product.tblDealItem where isDeleted=0) as TotalRecords
	  FROM [Product].[tblDealItem] as deal
	  Inner join [Product].[tblMeal] as meal ON meal.mealID=deal.mealID
   WHERE [dealID]=@pDealID
   and deal.isDeleted=0

	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Product].[uspGetDealItemByID]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 25/06/2018
-- Description:	deal By ID
-- Exec [Product].[uspGetDealItemByID] 1

-- =============================================
CREATE PROCEDURE [Product].[uspGetDealItemByID]

				@pDealID int	 
AS
BEGIN
	BEGIN TRY
       
	SELECT  [itemID]
	  ,deal.dealID
	  ,meal.title
	  ,meal.price
	  ,meal.description
	  ,meal.photo
	  ,meal.serving
      ,deal.[isActive]
      ,deal.[isDeleted]
      ,deal.[dateCreated]
	  ,(select count(*) from Product.tblDealItem where isDeleted=0) as TotalRecords
	  FROM [Product].[tblDealItem] as deal
	  Inner join [Product].[tblMeal] as meal ON meal.mealID=deal.mealID
   WHERE [dealID]=@pDealID
   and deal.isDeleted=0

	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Product].[uspGetDeals]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 26/06/2018
-- Description:	Product Deal
-- Exec  [Product].[uspGetDeals] null,0,1,15,'Title',1

-- =============================================
CREATE PROCEDURE [Product].[uspGetDeals]

				@pSearchText				NVARCHAR(500) =NULL,
				@pSellerID				   int =0,
				@pPageNumber				INT = 1,
				@pPageSize					INT = 15,
				@pSortColumn     			NVARCHAR(250) = NULL,
				@pSortColumnIndex			TINYINT=0

				 
AS
BEGIN
	BEGIN TRY
	DECLARE		@Query			nvarchar(max),
				@vCriteria		nVarchar(Max),
				@vOrderBy		nvarchar(max),
				@vSortColumn	nvarchar(max),
				@curDate		date = getdate(),
				@vCriteria1		nVarchar(Max)

	IF (ISNULL(@pPageNumber,0) = 0) SET @pPageNumber=1  
	IF (ISNULL(@pPageSize,0) = 0)  SET @pPageSize=10  
		
	IF(@pSortColumnIndex < 1)  
		SET @vSortColumn = ' ASC'  
	ELSE  
		SET @vSortColumn = ' DESC'

	SET @vSortColumn = @pSortColumn + @vSortColumn
	Set @vCriteria	 = ' WHERE  deal.isDeleted=0 '
	IF isnull(@pSearchText,'')<>'' SET @vCriteria = @vCriteria + Char(13) + 'and title like ''%' + @pSearchText + '%'''	
	IF isnull(@pSellerID,0 )<> 0 SET @vCriteria = @vCriteria + Char(13) + 'and sel.profileID = '+  Cast(@pSellerID as nvarchar(20)) 
	
	
	SET @vOrderBy =' ORDER BY	1'+/*@vSortColumn*/+Char(13)
	SET @vOrderBy =@vOrderBy+ ' OFFSET ( '+Cast(@pPageSize as nvarchar(20)) +'* ( '+Cast(@pPageNumber as nvarchar(20))+'-1)) ROWS'+Char(13)
	SET @vOrderBy =@vOrderBy+  ' FETCH NEXT '+ Cast(@pPageSize as nvarchar(20)) +' ROWS ONLY	'+Char(13)

	SET @Query = '  SELECT Row_number() over (order by ' + @vSortColumn+' ) as RowNum,		
      [dealID]
      ,deal.[profileID]
      ,deal.[title]
      ,deal.[description]
      ,deal.[photo]
      ,deal.[serving]
      ,deal.[isFeatured]
      ,deal.[price]
      ,deal.[isActive]
      ,deal.[isDeleted]
      ,deal.[dateCreated]
	  ,sel.FolderID as folderID
	  ,sel.displayTitle
	  ,pro.firstName +'' ''+ pro.lastName  fullName
	  ,sel.FolderID
	  ,Count(1) over()	AS TotalRecords 
	  FROM [Product].[tblDeal] as deal
	  Inner join [Profile].[tblSeller] as sel ON sel.profileID=deal.profileID
      Inner join [Profile].tblUser as pro ON pro.profileID=deal.profileID'+ +Char(13)+@vCriteria+@vOrderBy
	
	Print substring(@Query , 0 , 4000)
	Exec sp_executesql @Query

	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Product].[uspGetMealItemByID]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 4/06/2018
-- Description:	Meal By ID
-- Exec [Product].[uspGetMealItemByID] 2

-- =============================================
CREATE PROCEDURE [Product].[uspGetMealItemByID]

				@pMealID int	 
AS
BEGIN
	BEGIN TRY
      
	DECLARE @vSubCatID int
	SELECT @vSubCatID=subCategoryID from Product.tblMeal where  mealID=@pMealID

	SELECT [mealID]
      ,meal.[profileID]
      ,meal.[subCategoryID]
	  ,sub.[name] subCategory
	  ,cat.[name] category
      ,meal.[categoryID]
      ,meal.[title]
      ,meal.[description]
      ,meal.[photo]
      ,meal.[serving]
      ,meal.[isSpeciality]
      ,meal.[isFeature]
      ,meal.[price]
     -- ,meal.[mealTypeID]
	 -- ,mtype.[name] mealType
      ,meal.[isActive]
      ,meal.[isDeleted]
      ,meal.[dateCreated]
	  ,meal.saturday
	  ,meal.sunday
	  ,meal.monday
	  ,meal.tuesday
	  ,meal.wednesday
	  ,meal.thursday
	  ,meal.friday
	  ,FolderID
	  ,displayTitle +'('+ pro.firstName +' '+ pro.lastName +')' displayTitle
	  ,pro.firstName +' '+ pro.lastName as fullName
	  ,cur.sign as currency
	  FROM [Product].[tblMeal] as meal
	  Inner join [Product].[tblCategory] as cat ON cat.categoryID=meal.categoryID
	  Inner join [Product].[tblSubCategory] as sub ON sub.subCategoryID=meal.subCategoryID
	  Inner join [Profile].[tblSeller] as sel ON sel.profileID=meal.profileID
	  Inner join [Profile].tblUser as pro ON pro.profileID=meal.profileID
	 left outer  join Profile.tblUserAddress as pua ON pua.profileID=sel.profileID and pua.addressTypeID=4 and pua.isActive=1 and pua.isDeleted=0
	 left outer  join Lookup.tblCountry as cty ON cty.countryID=pua.countryID
	 inner join Lookup.tblCurrency as cur ON cur.currencyID=cty.currency
  Where [mealID]=@pMealID


 SELECT [mealTypeID]
      ,[mealID]
      ,[typeID]
      ,[isActive]
      ,[isDeleted]
      ,[dateModified]
      ,[dateCreated]
  FROM [Product].[tblMealTypes]
  Where [mealID]=@pMealID and isDeleted=0 

  SELECT [galleryID]
      ,[galleryTypeID]
      ,[sellerID]
      ,[title]
      ,[filename]
      ,[isActive]
      ,[isDeleted]
      ,[dateModified]
      ,[dateCreated]
      ,[mealID]
  FROM [Product].[tblGallery]
  Where [mealID]=@pMealID and isDeleted=0 

   	SELECT 
		 aon.addOnID 
		,aop.optionID 
		,aon.title as title
		,aop.title as optionTitle
		,sub.name
		,aon.cntrl
		,aop.price as price
	FROM  Lookup.tblAddOns as aon
		LEFT OUTER JOIN Lookup.tblAddOnOptions as aop ON aop.addOnID=aon.addOnID and aop.isActive=1 and aop.isDeleted=0
		LEFT OUTER JOIN Product.tblSubCategory as sub ON sub.subCategoryID=aon.subCatID
	WHERE aon.isDeleted=0 and aon.isActive=1 and aon.subCatID=@vSubCatID

	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Product].[uspGetMealItems]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 20/03/2018
-- Description:	Product Category
-- Exec   [Product].[uspGetMealItems] '',0,0,0,'',1,15,'Title',1,NULL,1

-- =============================================
CREATE PROCEDURE [Product].[uspGetMealItems]

				@pSearchText				NVARCHAR(500) =NULL,
				@pCategoryID				int =0,
				@pSellerID				   int =0,
				@pSubCategoryID				int=0,
				@pTitle						NVARCHAR(500) =NULL,
				@pPageNumber				INT = 1,
				@pPageSize					INT = 15,
				@pSortColumn     			NVARCHAR(250) = NULL,
				@pSortColumnIndex			TINYINT=0,
				@pIsFeatured				int = NULL,
				@pIsSpeaciality				int =NULL
				 
AS
BEGIN
	BEGIN TRY
	DECLARE		@Query			nvarchar(max),
				@vCriteria		nVarchar(Max),
				@vOrderBy		nvarchar(max),
				@vSortColumn	nvarchar(max),
				@curDate		date = getdate(),
				@vCriteria1		nVarchar(Max)

	IF (ISNULL(@pPageNumber,0) = 0) SET @pPageNumber=1  
	IF (ISNULL(@pPageSize,0) = 0)  SET @pPageSize=10  
		
	IF(@pSortColumnIndex < 1)  
		SET @vSortColumn = ' ASC'  
	ELSE  
		SET @vSortColumn = ' DESC'

	SET @vSortColumn = @pSortColumn + @vSortColumn
	Set @vCriteria	 = ' WHERE  meal.isDeleted=0 '
	IF isnull(@pSearchText,'')<>'' SET @vCriteria = @vCriteria + Char(13) + 'and title like ''%' + @pSearchText + '%'''
    IF isnull(@pCategoryID,0 )<> 0 SET @vCriteria = @vCriteria + Char(13) + 'and meal.categoryID = ' +  Cast(@pCategoryID as nvarchar(20)) 

	IF isnull(@pSubCategoryID,0 )<> 0 SET @vCriteria = @vCriteria + Char(13) + 'and meal.subCategoryID = '+  Cast(@pSubCategoryID as nvarchar(20)) 
	IF isnull(@pTitle,'' )<> '' SET @vCriteria = @vCriteria + Char(13) + 'and (sel.displayTitle like ''%' + @pTitle + '%'' OR pro.firstName like ''%' + @pTitle + '%'' OR pro.lastName like ''%' + @pTitle + '%'')'
	
	IF isnull(@pSellerID,0 )<> 0 SET @vCriteria = @vCriteria + Char(13) + 'and sel.profileID = '+  Cast(@pSellerID as nvarchar(20)) 
	
	IF @pIsFeatured = 1 SET @vCriteria = @vCriteria + Char(13) + 'and meal.isFeature = 1'-- + Cast(@pIsFeatured as char(1))
	IF @pIsSpeaciality = 1 SET @vCriteria = @vCriteria + Char(13) + 'and meal.isSpeciality = 1'
	--IF @pIsSpeaciality is not null  SET @vCriteria = @vCriteria + Char(13) + 'and meal.isSpeciality = ' + Cast(@pIsSpeaciality as char(1)) 

	SET @vOrderBy =' ORDER BY	1'+/*@vSortColumn*/+Char(13)
	SET @vOrderBy =@vOrderBy+ ' OFFSET ( '+Cast(@pPageSize as nvarchar(20)) +'* ( '+Cast(@pPageNumber as nvarchar(20))+'-1)) ROWS'+Char(13)
	SET @vOrderBy =@vOrderBy+  ' FETCH NEXT '+ Cast(@pPageSize as nvarchar(20)) +' ROWS ONLY	'+Char(13)

	SET @Query = ' SELECT Row_number() over (order by ' + @vSortColumn+' ) as RowNum,		
      [mealID]
      ,meal.[profileID]
      ,meal.[subCategoryID]
	  ,sub.[name] subCategory
	  ,cat.[name] category
      ,meal.[categoryID]
      ,meal.[title]
      ,meal.[description]
      ,meal.[photo]
      ,meal.[serving]
      ,meal.[isSpeciality]
      ,meal.[isFeature]
      ,meal.[price]
      --,meal.[mealTypeID]
	--  ,mtype.[name] mealType
      ,meal.[isActive]
      ,meal.[isDeleted]
      ,meal.[dateCreated]
	  ,sel.displayTitle
	  ,pro.firstName +'' ''+ pro.lastName  fullName
	  ,sel.FolderID
	  ,Count(1) over()	AS TotalRecords 
	  FROM [Product].[tblMeal] as meal
	  Inner join [Product].[tblCategory] as cat ON cat.categoryID=meal.categoryID
	  Inner join [Product].[tblSubCategory] as sub ON sub.subCategoryID=meal.subCategoryID
	  --Inner join [Lookup].[tblMealType] as mtype ON mtype.mealTypeID=meal.mealTypeID 
	  Inner join [Profile].[tblSeller] as sel ON sel.profileID=meal.profileID
      Inner join [Profile].tblUser as pro ON pro.profileID=meal.profileID'+ +Char(13)+@vCriteria+@vOrderBy
	
	--Print substring(@Query , 0 , 4000)
	Exec sp_executesql @Query

	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Product].[uspGetOrderByID]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 4/06/2018
-- Description:	Order By ID
-- Exec [Product].[uspGetOrderByID] 1

-- =============================================
CREATE PROCEDURE [Product].[uspGetOrderByID]

				@pOrderID int	 
AS
BEGIN
	BEGIN TRY
       
	 SELECT 	
       ord.[orderID]
      ,ord.[sellerProfileID]
      ,ord.[buyerProfileID]
	  ,sel.displayTitle
	  ,sel.FolderID
	  ,pro.firstName +' '+ pro.lastName  seller
	  ,buy.firstName +' '+ buy.lastName  buyer
	  ,buy.phoneNumber as 'phone'
	  ,buy.mobile 
	  ,ord.deliveryDate
	  ,ord.orderDate
      ,ord.deliveryAddress
      ,ord.[quantity]
      ,ord.[ratingID]
      ,rat.[description]
      ,ord.[comment]
      ,ord.[orderLastStatusID]
      ,[stat].[status]
      ,ord.[price]
      ,ord.[paymentDone]
	  ,ord.recieptNumber
      ,ord.[isActive]
      ,ord.[isDeleted]
	  ,Count(1) over()	AS TotalRecords 
	  FROM [Product].[tblOrder] as ord
	  Inner join [Profile].[tblSeller] as sel ON sel.profileID=ord.sellerProfileID
      Inner join [Profile].[tblUser] as pro ON pro.profileID=ord.sellerProfileID
	  Inner join [Profile].[tblUser] as buy ON buy.profileID=ord.buyerProfileID
	  Left Outer join [Lookup].[tblRating] as rat ON rat.ratingID=ord.ratingID
	  --Inner join [Product].[tblOrderStatus] as os ON os.orderStatusID=ord.orderLastStatusID
	  Left Outer join [Lookup].[tblOrderStatus] as stat ON stat.orderStatusID= ord.orderLastStatusID
 WHERE  ord.orderID=@pOrderID 


 SELECT stat.orderStatusID
 ,stat.orderID
 ,stat.orderStatusTypeID
 ,lstat.status 
 ,lstat.dateCreated
 FROM Product.tblOrderStatus as stat
 Inner join [Lookup].[tblOrderStatus] as lstat ON lstat.orderStatusID=stat.orderStatusTypeID 
 WHERE  stat.orderID=@pOrderID 
 
 SELECT item.orderID
 ,item.orderItemID
 ,item.mealID
 ,item.quantity 
 ,CASE WHEN ISNULL(meal.mealID,0)=0 THEN deal.price ELSE meal.price END as price
 ,CASE WHEN ISNULL(meal.mealID,0)=0  THEN deal.photo ELSE meal.photo END as photo    
 ,CASE WHEN ISNULL(meal.mealID,0)=0  THEN deal.title ELSE meal.title END as title
 ,CASE WHEN ISNULL(meal.mealID,0)=0  THEN 1 ELSE 0 END  as isDeal
 ,item.comment 
 FROM Product.tblOrderItem as item
 left outer join [Product].[tblMeal] as meal ON meal.mealID=item.mealID
 left outer join [Product].[tblDeal] as Deal ON deal.dealID=item.dealID
 WHERE  item.orderID=@pOrderID 

 END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Product].[uspGetSellerMealItems]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 25/06/2018
-- Description:	Meal items By seller ID
-- Exec [Product].[uspGetSellerMealItems] 1

-- =============================================
CREATE PROCEDURE [Product].[uspGetSellerMealItems]

				@pProfileID int	 
AS
BEGIN
	BEGIN TRY
       
	SELECT [mealID]
      ,meal.[profileID]
      ,meal.[title]
      ,meal.[description]
      ,meal.[photo]
      ,meal.[serving]
      ,meal.[isSpeciality]
      ,meal.[isFeature]
      ,meal.[price]
      ,meal.[isActive]
      ,meal.[isDeleted]
      ,meal.[dateCreated]
	  FROM [Product].[tblMeal] as meal
  Where [profileID]=@pProfileID
  and isActive=1
  and isDeleted=0

	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Product].[uspGetSellerMeals]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 25/06/2018
-- Description:	Meal items By seller ID
-- EXEC [Product].[uspGetSellerMeals] 1

-- =============================================
CREATE PROCEDURE [Product].[uspGetSellerMeals]

				@pSearchText				NVARCHAR(500) =NULL,
				@pSellerID				   int =0,
				@pPageNumber				INT = 1,
				@pPageSize					INT = 15,
				@pSortColumn     			NVARCHAR(250) = NULL,
				@pSortColumnIndex			TINYINT=0

AS
BEGIN
	BEGIN TRY
	DECLARE		@Query			nvarchar(max),
				@vCriteria		nVarchar(Max),
				@vOrderBy		nvarchar(max),
				@vSortColumn	nvarchar(max),
				@curDate		date = getdate(),
				@vCriteria1		nVarchar(Max)

	IF (ISNULL(@pPageNumber,0) = 0) SET @pPageNumber=1  
	IF (ISNULL(@pPageSize,0) = 0)  SET @pPageSize=10  
		
	IF(@pSortColumnIndex < 1)  
		SET @vSortColumn = ' ASC'  
	ELSE  
		SET @vSortColumn = ' DESC'

	SET @vSortColumn = @pSortColumn + @vSortColumn
	Set @vCriteria	 = ' WHERE  meal.isDeleted=0 '
	IF isnull(@pSearchText,'')<>'' SET @vCriteria = @vCriteria + Char(13) + 'and title like ''%' + @pSearchText + '%'''
    IF isnull(@pSellerID,0 )<> 0 SET @vCriteria = @vCriteria + Char(13) + 'and sel.profileID = ' +  Cast(@pSellerID as nvarchar(20)) 

	SET @vOrderBy =' ORDER BY	1'+/*@vSortColumn*/+Char(13)
	SET @vOrderBy =@vOrderBy+ ' OFFSET ( '+Cast(@pPageSize as nvarchar(20)) +'* ( '+Cast(@pPageNumber as nvarchar(20))+'-1)) ROWS'+Char(13)
	SET @vOrderBy =@vOrderBy+  ' FETCH NEXT '+ Cast(@pPageSize as nvarchar(20)) +' ROWS ONLY	'+Char(13)

	SET @Query = ' SELECT Row_number() over (order by ' + @vSortColumn+' ) as RowNum,		
      [mealID]
      ,meal.[profileID]
      ,meal.[subCategoryID]
	  ,sub.[name] subCategory
	  ,cat.[name] category
      ,meal.[categoryID]
      ,meal.[title]
      ,meal.[description]
      ,meal.[photo]
      ,meal.[serving]
      ,meal.[isSpeciality]
      ,meal.[isFeature]
      ,meal.[price]
      --,meal.[mealTypeID]
	--  ,mtype.[name] mealType
      ,meal.[isActive]
      ,meal.[isDeleted]
      ,meal.[dateCreated]
	  ,sel.displayTitle
	  ,pro.firstName +'' ''+ pro.lastName  fullName
	  ,sel.FolderID
	  ,Count(1) over()	AS TotalRecords 
	  FROM [Product].[tblMeal] as meal
	  Inner join [Product].[tblCategory] as cat ON cat.categoryID=meal.categoryID
	  Inner join [Product].[tblSubCategory] as sub ON sub.subCategoryID=meal.subCategoryID
	  --Inner join [Lookup].[tblMealType] as mtype ON mtype.mealTypeID=meal.mealTypeID 
	  Inner join [Profile].[tblSeller] as sel ON sel.profileID=meal.profileID
      Inner join [Profile].tblUser as pro ON pro.profileID=meal.profileID'+ +Char(13)+@vCriteria+@vOrderBy
	
	Print substring(@Query , 0 , 4000)
	--Exec sp_executesql @Query

	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Product].[uspGetSubCategories]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 30/05/2018
-- Description:	Product Sub Category
-- Exec [Product].[uspGetSubCategories] '',1,10,'name',1
-- =============================================
CREATE PROCEDURE [Product].[uspGetSubCategories]

				@pSearchText				NVARCHAR(500),
				@pPageNumber				INT = 1,
				@pPageSize					INT = 15,
				@pSortColumn     			NVARCHAR(250) = NULL,
				@pSortColumnIndex			TINYINT=0
				 
AS
BEGIN
	BEGIN TRY
	DECLARE		@Query			nvarchar(max),
				@vCriteria		nVarchar(Max),
				@vOrderBy		nvarchar(max),
				@vSortColumn	nvarchar(max),
				@curDate		date = getdate(),
				@vCriteria1		nVarchar(Max)

	IF (ISNULL(@pPageNumber,0) = 0) SET @pPageNumber=1  
	IF (ISNULL(@pPageSize,0) = 0)  SET @pPageSize=10  
		
	IF(@pSortColumnIndex < 1)  
		SET @vSortColumn = ' ASC'  
	ELSE  
		SET @vSortColumn = ' DESC'

	SET @vSortColumn = @pSortColumn + @vSortColumn
	Set @vCriteria	 = ' WHERE sub.isDeleted=0 '
	IF isnull(@pSearchText,'')<>'' SET @vCriteria = @vCriteria + Char(13) + 'and sub.name like ''%' + @pSearchText + '%'''


	SET @vOrderBy =' ORDER BY	1'+/*@vSortColumn*/+Char(13)
	SET @vOrderBy =@vOrderBy+ ' OFFSET ( '+Cast(@pPageSize as nvarchar(20)) +'* ( '+Cast(@pPageNumber as nvarchar(20))+'-1)) ROWS'+Char(13)
	SET @vOrderBy =@vOrderBy+  ' FETCH NEXT '+ Cast(@pPageSize as nvarchar(20)) +' ROWS ONLY	'+Char(13)

	SET @Query = ' SELECT Row_number() over (order by sub.' + @vSortColumn+' ) as RowNum,		
	   sub.[subCategoryID]
	  ,sub.[categoryID]
      ,sub.[name]
	  ,cat.[name] categoryName
      ,sub.[description]
      ,sub.[isActive]
      ,sub.[isDeleted]
      ,sub.[dateModified]
      ,sub.[dateCreated]
	  ,Count(1) over()	AS TotalRecords 
	FROM [Product].[tblSubCategory] as  sub
	INNER JOIN [Product].[tblCategory] as cat ON cat.categoryID=sub.categoryID' + +Char(13)+@vCriteria+@vOrderBy
	
	Print substring(@Query , 0 , 4000)
	Exec sp_executesql @Query

	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Product].[uspGetSubCategoryByID]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 20/03/2018
-- Description:	Product Category
-- Exec [Product].[uspGetSubCategoryByID] 1

-- =============================================
CREATE PROCEDURE [Product].[uspGetSubCategoryByID]

				@pSubCategoryID int	 
AS
BEGIN
	BEGIN TRY
       
	   SELECT 	
	   sub.[categoryID]
	  ,sub.[subCategoryID]
      ,sub.[name]
      ,sub.[description]
      ,sub.[isActive]
      ,sub.[isDeleted]
      ,sub.[dateModified]
      ,sub.[dateCreated]
	  ,cat.name as 'categoryName'
	FROM [Product].[tblSubCategory] as sub
	Inner join [Product].[tblCategory] as cat ON cat.categoryID=sub.CategoryID
	WHERE sub.subCategoryID=@pSubCategoryID

	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Product].[uspInsertFavourites]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 04/06/2018
-- Description:	Product Meal
-- Exec [Product].[uspInsertUpdateMeal] null,'asdds','Baryani, Qorma, Palau',1
--select * from Profile.tblUserFavourites

-- =============================================
CREATE PROCEDURE [Product].[uspInsertFavourites]

	@pSellerID			int=null
   ,@pBuyerID			int=null

AS
BEGIN
	BEGIN TRY
    DECLARE @vUserFavouriteID int

    SET @vUserFavouriteID=Next Value for [dbo].[Seq_tblUserFavourite] 

	 IF NOT EXISTS (select 1 from Profile.tblUserFavourites (NoLock) where sellerProfileID = @pSellerID and buyerProfileID = @pBuyerID and IsDeleted = 0 AND IsActive = 1)
	  BEGIN
		  INSERT INTO [Profile].[tblUserFavourites]
           ([userfavouriteID]
		   ,[sellerProfileID]
           ,[buyerProfileID]
           ,[isActive]
           ,[isDeleted]
           ,[dateModified]
           ,[dateCreated])
		VALUES
           (@vUserFavouriteID
		   ,@pSellerID
           ,@pBuyerID
           ,1
           ,0
           ,GETDATE()
           ,GETDATE())

		   SELECT 1
	 END
	 ELSE 
	 BEGIN
	      SELECT 2
	 END
	END TRY
	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Product].[uspInsertOrder]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 04/06/2018
-- Description:	Product Meal
-- Exec [Product].[uspInsertUpdateMeal] null,'asdds','Baryani, Qorma, Palau',1
--select * from Product.tblOrder
--select * from Product.tblOrderItem
--select * from Lookup.tblOrderStatus
--select * from Product.tblOrderStatus
-- =============================================
CREATE PROCEDURE [Product].[uspInsertOrder]

    @pOrderID			int=null
   ,@pSellerID			int=null
   ,@pBuyerID			int=null
   ,@pQuantity			int=null
   ,@pOrderDate			datetime = null
   ,@pDeliveryAddress	nvarchar(max)=null
   ,@pComment		    nvarchar(max)=null
   ,@pPrice				nvarchar(250)=null	
  
  ,@pOrderItems		     as [Product].[OrderItems] Readonly
  ,@pOrderAddOns		 as [Product].[OrderAddOns] Readonly
	
     
AS
BEGIN
	BEGIN TRY
    DECLARE @vOrderID int
	DECLARE @vRecieptID int
	DECLARE @vQuantity int
	DECLARE @vPrice int
	DECLARE @vItemQuantity int

	IF ISNULL(@pOrderID,0) = 0
	BEGIN
	 select @vOrderID=orderID from [Product].[tblOrder] where orderLastStatusID=9 and sellerProfileID=@pSellerID and buyerProfileID=@pBuyerID and isActive=1 and isDeleted=0
	END
	ELSE
	BEGIN
	 SET @vOrderID=@pOrderID
	END
	IF ISNULL(@vOrderID,0) > 0
	BEGIN
			SELECT top 1 @vItemQuantity=quantity FROM @pOrderItems 
			SET @pPrice=@pPrice*@vItemQuantity
			SELECT @vPrice= @pPrice + SUM(Cast(isnull(price,0) as int))  from Product.tblOrder where orderID=@vOrderID 
			SELECT @vQuantity=count(*)+1 from Product.tblOrderItem where orderID=@vOrderID 

			UPDATE Product.tblOrder
			SET quantity=@vQuantity, price=CAST (@vPrice as nvarchar)
			WHERE orderID=@vOrderID

			Select Next Value for [dbo].[Seq_tblOrderItem] as orderItemID
									   ,@vOrderID as orderID
									   ,mealID
									   ,dealID
									   ,quantity
									   ,comment
			INTO #tempTblItems
			FROM @pOrderItems 

	   					INSERT INTO [Product].[tblOrderItem]
								   ([orderItemID]
								   ,[orderID]
								   ,[mealID]
								   ,[dealID]
								   ,[quantity]
								   ,[comment]
								   ,[isActive]
								   ,[isDeleted]
								   ,[dateModified]
								   ,[dateCreated])
						 Select     orderItemID
								   ,orderID
								   ,mealID
								   ,dealID
								   ,quantity
								   ,comment
								   ,1
								   ,0
								   ,GETDATE()
								   ,GETDATE()
						FROM #tempTblItems 
				   

				
					INSERT INTO [Product].[tblOrderAddOns]
							   ([orderAddOnID]
							   ,[orderItemID]
							   ,[optionID]
							   ,[isActive]
							   ,[isDeleted]
							   ,[dateModified]
							   ,[dateCreated])
				    Select Next Value for [dbo].[Seq_tblOrderAddOns] 
							   ,(select item.orderItemID from #tempTblItems as item where (item.mealID=AddOn.orderID OR item.dealID=AddOn.orderID))
							   ,optionID
							   ,1
							   ,0
							   ,GETDATE()
							   ,GETDATE()
					FROM @pOrderAddOns as AddOn 
			 select top 1 orderItemID as result from #tempTblItems 
		 drop table #tempTblItems
	END
	ELSE
	BEGIN
    SET @vOrderID=Next Value for [dbo].[Seq_tblOrder] 
	SET @vRecieptID=Next Value for [dbo].[Seq_tblReceipt] 
	SELECT top 1 @vItemQuantity=quantity FROM @pOrderItems 

				INSERT INTO [Product].[tblOrder]
				   ([orderID]
				   ,[sellerProfileID]
				   ,[buyerProfileID]
				   ,[quantity]
				   ,[orderDate]
				   ,[deliveryAddress]
				   ,[comment]
				   ,[orderLastStatusID]
				   ,[lastStatusDate]
				   ,[recieptNumber]
				   ,[price]
				   ,[isActive]
				   ,[isDeleted]
				   ,[dateModified]
				   ,[dateCreated]
				  )
				VALUES
					 (@vOrderID
					 ,@pSellerID
					 ,@pBuyerID
					 ,1
					 ,@pOrderDate
					 ,@pDeliveryAddress
					 ,@pComment
					 ,9
					 ,@pOrderDate
					 ,@vRecieptID
					 ,@pPrice*@vItemQuantity
					 ,1
					 ,0
					 ,GETDATE()
					 ,GETDATE()
					 )

					Select Next Value for [dbo].[Seq_tblOrderItem] as orderItemID
							   ,@vOrderID as orderID
							   ,mealID
							   ,dealID
							   ,quantity
							   ,comment
					INTO #temp2TblItems
					FROM @pOrderItems 

					INSERT INTO [Product].[tblOrderItem]
							   ([orderItemID]
							   ,[orderID]
							   ,[mealID]
							   ,[dealID]
							   ,[quantity]
							   ,[comment]
							   ,[isActive]
							   ,[isDeleted]
							   ,[dateModified]
							   ,[dateCreated])
					 Select     orderItemID
							   ,orderID
							   ,mealID
							   ,dealID
							   ,quantity
							   ,comment
							   ,1
							   ,0
							   ,GETDATE()
							   ,GETDATE()
					FROM #temp2TblItems 
				   

				
					INSERT INTO [Product].[tblOrderAddOns]
							   ([orderAddOnID]
							   ,[orderItemID]
							   ,[optionID]
							   ,[isActive]
							   ,[isDeleted]
							   ,[dateModified]
							   ,[dateCreated])
				    Select Next Value for [dbo].[Seq_tblOrderAddOns] 
							   ,(select item.orderItemID from #temp2TblItems as item where (item.mealID=AddOn.orderID OR item.dealID=AddOn.orderID))
							   ,optionID
							   ,1
							   ,0
							   ,GETDATE()
							   ,GETDATE()
					FROM @pOrderAddOns as AddOn 


					INSERT INTO [Product].[tblOrderStatus]
							   ([orderStatusID]
							   ,[orderID]
							   ,[orderStatusTypeID]
							   ,[isActive]
							   ,[isDeleted]
							   ,[dateModified]
							   ,[dateCreated])
				    Select Next Value for [dbo].[Seq_tblOrderStatus] 
							   ,@vOrderID
							   ,9
							   ,1
							   ,0
							   ,GETDATE()
							   ,GETDATE()
					FROM @pOrderItems 
					
		 --Insert into tblLogTimeline
			--	(profileID,dateCreated,dateModified,isActive,isDeleted,description)
			--	 Values (@pProfileID,GETDATE(),GETDATE(),1,0,'Added new Order '+ @pTitle +' .')
		 select top 1 orderItemID as result from #temp2TblItems 
		 drop table #temp2TblItems
	
	END 
	END TRY
	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Product].[uspInsertOrderRating]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 20/03/2018
-- Description:	Product Category
-- Exec [Product].[uspInsertUpdateCategory] null,'asdds','Baryani, Qorma, Palau',1

-- =============================================
CREATE PROCEDURE [Product].[uspInsertOrderRating]

    @pRating	int=null
   ,@pOrderID		int
   ,@pProfileID		int

AS
BEGIN
	BEGIN TRY
    DECLARE  @vRating int, @vSellerID int, @vAvgRating int, @vTotalClients int,@vTotalRating int --totalRating

    IF ISNULL(@pRating,0) > 0
	BEGIN
	    SELECT @vSellerID=sellerProfileID FROM Product.tblOrder WHERE orderID=@pOrderID
		SELECT @vTotalClients=ISNULL(ratedCount,0),@vTotalRating=ISNULL(totalRating,0) FROM Profile.tblSeller WHERE profileID=@vSellerID
		SET @vTotalClients=@vTotalClients + 1;

	    UPDATE Product.tblOrder
		SET ratingID=(select ratingID from Lookup.tblRating where ratingNumber=@pRating)
		WHERE orderID=@pOrderID

		SET @vTotalRating=@vTotalRating + @pRating
		SET @vAvgRating=@vTotalRating / @vTotalClients

		 UPDATE Profile.tblSeller
		SET ratedCount=@vTotalClients
		,totalRating=@vTotalRating
		,avgRating=@vAvgRating
		WHERE profileID=@vSellerID
	END
	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Product].[uspInsertUpdateCategory]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 20/03/2018
-- Description:	Product Category
-- Exec [Product].[uspInsertUpdateCategory] null,'asdds','Baryani, Qorma, Palau',1

-- =============================================
CREATE PROCEDURE [Product].[uspInsertUpdateCategory]

    @pCategoryID	int=null
   ,@pName			nvarchar(150)	
   ,@pDescription	nvarchar(max)=null
   ,@pProfileID		int
AS
BEGIN
	BEGIN TRY
       
    IF ISNULL(@pCategoryID,0) > 0
	BEGIN
	    IF NOT EXISTS (select 1 from [Product].[tblCategory] (NoLock) where [name] = @pName and IsDeleted = 0 and categoryID <> @pCategoryID)
		BEGIN
		UPDATE [Product].[tblCategory]
	    SET [name] = @pName
		  ,[description] = @pDescription
		  ,[dateModified] = GETDATE()
		  ,[modifiedBy] = @pProfileID
	    WHERE categoryID=@pCategoryID

		Insert into tblLogTimeline
					(profileID,dateCreated,dateModified,isActive,isDeleted,description)
				    Values (@pProfileID,GETDATE(),GETDATE(),1,0,'Update food category '+ @pName +' .')

	    select 1 as result;
		END
		ELSE
		BEGIN
		 select 5 as result;
		END
	END
	ELSE BEGIN
	     IF NOT EXISTS (select 1 from [Product].[tblCategory] (NoLock) where [name] = @pName and IsDeleted = 0)
		 BEGIN
		INSERT INTO [Product].[tblCategory]
           ([name]
           ,[description]
           ,[isActive]
           ,[isDeleted]
           ,[dateModified]
           ,[dateCreated]
           ,[createdBy]
           ,[modifiedBy])
		 VALUES
			   (@pName
			   ,@pDescription
			   ,1
			   ,0
			   ,getDate()
			   ,getDate()
			   ,@pProfileID
			   ,@pProfileID)

		 Insert into tblLogTimeline
				(profileID,dateCreated,dateModified,isActive,isDeleted,description)
				 Values (@pProfileID,GETDATE(),GETDATE(),1,0,'Added new food category '+ @pName +' .')
		 select 1 as result;
		END
		ELSE
		BEGIN
		 select 5 as result;
		END
	END
	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Product].[uspInsertUpdateDeal]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 26/06/2018
-- Description:	Product DEAL
-- Exec [Product].[uspInsertUpdateDeal]

-- =============================================
CREATE PROCEDURE [Product].[uspInsertUpdateDeal]

	@pDealID			int=null
   ,@pProfileID			int=null
   ,@pTitle				nvarchar(250)	
   ,@pDescription		nvarchar(max)=null
   ,@pPhoto				nvarchar(250)=null	
   ,@pServing			int=null
   ,@pIsFeatured		bit
   ,@pPrice				nvarchar(150)=null
   ,@pIsActive			bit
   ,@pModifiedBy		int
   ,@pDealItems		as    [Product].[DealMealItem] Readonly
AS
BEGIN
	BEGIN TRY
     DECLARE @vDealID int  
    IF ISNULL(@pDealID,0) > 0
	BEGIN
	    IF NOT EXISTS (select 1 from [Product].[tblDeal] (NoLock) where Title = @pTitle and IsDeleted = 0 and dealID <> @pDealID)
		BEGIN
		UPDATE [Product].[tblDeal]
		   SET [profileID] = @pProfileID
			  ,[title] = @pTitle
			  ,[description] = @pDescription
			  ,[photo] = @pPhoto
			  ,[serving] = @pServing
			  ,[isFeatured] = @pIsFeatured
			  ,[price] = @pPrice
			  ,[isActive] = @pIsActive
			  ,[isDeleted] = 0
			  ,[dateModified] = GETDATE()
			  ,[modifiedBy] = @pModifiedBy
		 WHERE dealID=@pDealID

		 IF EXISTS((select * FROM @pDealItems WHERE isDeleted=1))
		 BEGIN
				UPDATE Product.tblDealItem
				SET isDeleted=1
				WHERE itemID in(select itemID FROM @pDealItems WHERE isDeleted=1)
		 END
		 IF EXISTS((select * FROM @pDealItems WHERE isDeleted=0) )
		 BEGIN
		    INSERT INTO [Product].[tblDealItem]
           ([dealID]
           ,[mealID]
           ,[isActive]
           ,[isDeleted]
           ,[dateModified]
           ,[dateCreated]) 
		   Select @pDealID
		   ,mealID
		   ,1
		   ,0
		   ,GETDATE()
		   ,GETDATE()
		   FROM @pDealItems WHERE isDeleted=0
		 END
		Insert into tblLogTimeline
					(profileID,dateCreated,dateModified,isActive,isDeleted,description)
				    Values (@pProfileID,GETDATE(),GETDATE(),1,0,'Update Deal '+ @pTitle +' .')

	    select 1 as result;
		END
		ELSE
		BEGIN
		 select 5 as result;
		END
	END
	ELSE BEGIN
	    IF NOT EXISTS (select 1 from [Product].[tblDeal] (NoLock) where Title = @pTitle and profileID=@pProfileID and IsDeleted = 0)
		 BEGIN

		 SET @vDealID=Next Value for [dbo].[Seq_tblDeal]

			INSERT INTO [Product].[tblDeal]
				   ([dealID]
				   ,[title]
				   ,[description]
				   ,[profileID]
				   ,[photo]
				   ,[serving]
				   ,[isActive]
				   ,[isDeleted]
				   ,[dateModified]
				   ,[dateCreated]
				   ,[price]
				   ,[isFeatured]
				   ,[modifiedBy])
			 VALUES
				   (@vDealID
				   ,@pTitle
				   ,@pDescription
				   ,@pProfileID
				   ,@pPhoto
				   ,@pServing
				   ,@pIsActive
				   ,0
				   ,getdate()
				   ,getdate()
				   ,@pPrice
				   ,@pIsFeatured
				   ,@pModifiedBy)


         IF EXISTS(select * FROM @pDealItems WHERE isDeleted=0)
		 BEGIN
		    INSERT INTO [Product].[tblDealItem]
           ([dealID]
           ,[mealID]
           ,[isActive]
           ,[isDeleted]
           ,[dateModified]
           ,[dateCreated]) 
		   Select @vDealID
		   ,mealID
		   ,1
		   ,0
		   ,GETDATE()
		   ,GETDATE()
		   FROM @pDealItems WHERE isDeleted=0
		 END

		 Insert into tblLogTimeline
				(profileID,dateCreated,dateModified,isActive,isDeleted,description)
				 Values (@pProfileID,GETDATE(),GETDATE(),1,0,'Added new Deal '+ @pTitle +' .')
		 select 1 as result;
		END
		ELSE
		BEGIN
		 select 5 as result;
		END
	END
	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Product].[uspInsertUpdateMeal]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 04/06/2018
-- Description:	Product Meal
-- Exec [Product].[uspInsertUpdateMeal] null,'asdds','Baryani, Qorma, Palau',1

-- =============================================
CREATE PROCEDURE [Product].[uspInsertUpdateMeal]

	@pMealID			int=null
   ,@pProfileID			int=null
   ,@pSubCategoryID	    int=null
   ,@pCategoryID	    int=null
   ,@pTitle				nvarchar(250)	
   ,@pDescription		nvarchar(max)=null
   ,@pPhoto				nvarchar(250)=null	
   ,@pServing			int=null
   ,@pIsSpeciality	    bit
   ,@pIsFeature			bit
   ,@pPrice				nvarchar(150)=null
  -- ,@pMealTypeID		int=null
   ,@pIsActive			bit

    ,@pMonday			bit
	,@pTuesday			bit
    ,@pWednesday		bit
	,@pThursday			bit
	,@pFriday			bit
    ,@pSaturday			bit
    ,@pSunday			bit
    ,@pModifiedBy		int


	,@pMealTypes		 as Product.MealType Readonly
	,@pGalleryItems		 as Product.GalleryItems Readonly
     
AS
BEGIN
	BEGIN TRY
    DECLARE @vMealID int
	DECLARE @vPhoto nvarchar(500)

	if((select count(*) from @pGalleryItems where  isDeleted=0 ) > 0)
	begin
		SELECT  top 1 @vPhoto=g.filename from @pGalleryItems  as g  where isDeleted=0 
	end
	else IF ISNULL(@pMealID,0) > 0
	begin
		SELECT top 1 @vPhoto=g.filename from product.tblgallery  as g  where isDeleted=0 and mealID=@pMealID
	end

    IF ISNULL(@pMealID,0) > 0
	BEGIN
	    IF NOT EXISTS (select 1 from [Product].[tblMeal] (NoLock) where Title = @pTitle and IsDeleted = 0 and mealID <> @pMealID and categoryID <> @pCategoryID and subCategoryID <> @pSubCategoryID)
		BEGIN
		UPDATE [Product].[tblMeal]
		   SET [profileID] = @pProfileID
			  ,[subCategoryID] = @pSubCategoryID
			  ,[categoryID] = @pCategoryID
			  ,[title] = @pTitle
			  ,[description] = @pDescription
			  ,[photo] = @vPhoto
			  ,[serving] = @pServing
			  ,[isSpeciality] = @pIsSpeciality
			  ,[isFeature] = @pIsFeature
			  ,[price] = @pPrice
			 -- ,[mealTypeID] = @pMealTypeID
			  ,[isActive] = @pIsActive
			  ,[isDeleted] = 0
			  ,[dateModified] = GETDATE()
			  ,[monday] = @pMonday
			  ,[tuesday] = @pTuesday
			  ,[wednesday] = @pWednesday
			  ,[thursday] = @pThursday
			  ,[friday] = @pFriday
			  ,[saturday] = @pSaturday
			  ,[sunday] = @pSunday
			  ,[modifiedBy] = @pModifiedBy
		 WHERE mealID=@pMealID

		 IF EXISTS((select * FROM @pMealTypes WHERE isDeleted=1))
		 BEGIN
				UPDATE Product.tblMealTypes
				SET isDeleted=1
				WHERE mealTypeID in(select mealTypeID FROM @pMealTypes WHERE isDeleted=1)
		 END
		 IF EXISTS((select * FROM @pMealTypes WHERE isDeleted=0) )
		 BEGIN

		 INSERT INTO [Product].[tblMealTypes]
           ([mealTypeID]
           ,[mealID]
           ,[typeID]
           ,[isActive]
           ,[isDeleted]
           ,[dateModified]
           ,[dateCreated])
		   Select 
		    Next Value for [dbo].[Seq_tblMealType] 
		   ,@pMealID
		   ,typeID
		   ,1
		   ,0
		   ,GETDATE()
		   ,GETDATE()
		   FROM @pMealTypes WHERE isDeleted=0
		 END

		 IF EXISTS((select * FROM @pGalleryItems WHERE isDeleted=1))
		 BEGIN
				UPDATE Product.tblGallery
				SET isDeleted=1
				WHERE galleryID in(select galleryID FROM @pGalleryItems WHERE isDeleted=1)
		 END
		 IF EXISTS((select * FROM @pGalleryItems WHERE isDeleted=0) )
		 BEGIN
		INSERT INTO [Product].[tblGallery]
           ([galleryID]
           ,[galleryTypeID]
           ,[sellerID]
           ,[title]
           ,[filename]
           ,[isActive]
           ,[isDeleted]
           ,[dateModified]
           ,[dateCreated]
           ,[mealID])
		   Select 
		    Next Value for  [dbo].[Seq_tblGallery]  
		   ,1
		   ,@pProfileID
		   ,''
		   ,[filename]
		   ,1
		   ,0
		   ,GETDATE()
		   ,GETDATE()
		   ,@pMealID
		   FROM @pGalleryItems WHERE isDeleted=0
		 END

		Insert into tblLogTimeline
					(profileID,dateCreated,dateModified,isActive,isDeleted,description)
				    Values (@pProfileID,GETDATE(),GETDATE(),1,0,'Update Meal Item '+ @pTitle +' .')

	    select 1 as result;
		END
		ELSE
		BEGIN
		 select 5 as result;
		END
	END
	ELSE BEGIN
	    IF NOT EXISTS (select 1 from [Product].[tblMeal] (NoLock) where Title = @pTitle and IsDeleted = 0 and categoryID <> @pCategoryID and subCategoryID <> @pSubCategoryID)
		 BEGIN

		 SET @vMealID=Next Value for [dbo].[Seq_tblMeal] 

				INSERT INTO [Product].[tblMeal]
				   ([mealID]
				   ,[profileID]
				   ,[subCategoryID]
				   ,[categoryID]
				   ,[title]
				   ,[description]
				   ,[photo]
				   ,[serving]
				   ,[isSpeciality]
				   ,[isFeature]
				   ,[price]
				   --,[mealTypeID]
				   ,[isActive]
				   ,[isDeleted]
				   ,[dateModified]
				   ,[dateCreated]
				   ,[monday]
				   ,[tuesday]
				   ,[wednesday]
				   ,[thursday]
				   ,[friday]
				   ,[saturday]
				   ,[sunday]
				   ,[modifiedBy])
				VALUES
					 (@vMealID
					 ,@pProfileID
					 ,@pSubCategoryID
					 ,@pCategoryID
					 ,@pTitle
					 ,@pDescription
					 ,@vPhoto
					 ,@pServing
					 ,@pIsSpeciality
					 ,@pIsFeature
					 ,@pPrice
					 --,@pMealTypeID
					 ,1
					 ,0
					 ,GETDATE()
					 ,GETDATE()
					 ,@pMonday
					 ,@pTuesday
					 ,@pWednesday
					 ,@pThursday
					 ,@pFriday
					 ,@pSaturday
					 ,@pSunday
					 ,@pModifiedBy)

			
					 IF EXISTS((select * FROM @pMealTypes WHERE isDeleted=0) )
					 BEGIN
							 INSERT INTO [Product].[tblMealTypes]
							   ([mealTypeID]
							   ,[mealID]
							   ,[typeID]
							   ,[isActive]
							   ,[isDeleted]
							   ,[dateModified]
							   ,[dateCreated])
							   Select 
								Next Value for [dbo].[Seq_tblMealType] 
							   ,@vMealID
							   ,typeID
							   ,1
							   ,0
							   ,GETDATE()
							   ,GETDATE()
							   FROM @pMealTypes WHERE isDeleted=0
					 END
				
					IF EXISTS((select * FROM @pGalleryItems WHERE isDeleted=0) )
					BEGIN
					INSERT INTO [Product].[tblGallery]
					   ([galleryID]
					   ,[galleryTypeID]
					   ,[sellerID]
					   ,[title]
					   ,[filename]
					   ,[isActive]
					   ,[isDeleted]
					   ,[dateModified]
					   ,[dateCreated]
					   ,[mealID])
					   Select 
						Next Value for  [dbo].[Seq_tblGallery]  
					   ,1
					   ,@pProfileID
					   ,''
					   ,[filename]
					   ,1
					   ,0
					   ,GETDATE()
					   ,GETDATE()
					   ,@vMealID
					   FROM @pGalleryItems WHERE isDeleted=0
					 END
		 Insert into tblLogTimeline
				(profileID,dateCreated,dateModified,isActive,isDeleted,description)
				 Values (@pProfileID,GETDATE(),GETDATE(),1,0,'Added new Meal Item '+ @pTitle +' .')
		 select 1 as result;
		END
		ELSE
		BEGIN
		 select 5 as result;
		END
	END
	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Product].[uspInsertUpdateSubCategory]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 20/03/2018
-- Description:	Product Category
-- Exec [Product].[uspInsertUpdateSubCategory] null,'1','Baryani', 'Chicken, sindhi, special' ,1

-- =============================================
CREATE PROCEDURE [Product].[uspInsertUpdateSubCategory]

	@pSubCategoryID	int=null
   ,@pCategoryID	int=null
   ,@pName			nvarchar(150)	
   ,@pDescription	nvarchar(max)=null
   ,@pProfileID		int
AS
BEGIN
	BEGIN TRY
       
    IF ISNULL(@pSubCategoryID,0) > 0
	BEGIN
	    IF NOT EXISTS (select 1 from [Product].[tblSubCategory] (NoLock) where [name] = @pName and IsDeleted = 0 and subCategoryID <> @pSubCategoryID and categoryID=@pCategoryID)
		BEGIN
		UPDATE [Product].[tblSubCategory]
	    SET [name] = @pName
		  ,[description] = @pDescription
		  ,[categoryID]=@pCategoryID
		  ,[dateModified] = GETDATE()
		  ,[modifiedBy] = @pProfileID
	    WHERE subCategoryID=@pSubCategoryID

		Insert into tblLogTimeline
					(profileID,dateCreated,dateModified,isActive,isDeleted,description)
				    Values (@pProfileID,GETDATE(),GETDATE(),1,0,'Update food sub category '+ @pName +' .')

	    select 1 as result;
		END
		ELSE
		BEGIN
		 select 5 as result;
		END
	END
	ELSE BEGIN
	     IF NOT EXISTS (select 1 from [Product].[tblSubCategory] (NoLock) where [name] = @pName and categoryID=@pCategoryID and IsDeleted = 0)
		 BEGIN
		INSERT INTO [Product].[tblSubCategory]
           ([name]
		   ,[categoryID]
           ,[description]
           ,[isActive]
           ,[isDeleted]
           ,[dateModified]
           ,[dateCreated]
           ,[createdBy]
           ,[modifiedBy])
		 VALUES
			   (@pName
			   ,@pCategoryID
			   ,@pDescription
			   ,1
			   ,0
			   ,getDate()
			   ,getDate()
			   ,@pProfileID
			   ,@pProfileID)

		 Insert into tblLogTimeline
				(profileID,dateCreated,dateModified,isActive,isDeleted,description)
				 Values (@pProfileID,GETDATE(),GETDATE(),1,0,'Added new food sub category '+ @pName +' .')
		 select 1 as result;
		END
		ELSE
		BEGIN
		 select 5 as result;
		END
	END
	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Product].[uspMarkCategoryActive]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 20/03/2018
-- Description:	Product Category
-- Exec [Product].[uspInsertUpdateCategory] null,'Pakistani','Baryani, Qorma, Palau',1
-- Exec [Product].[uspInsertUpdateCategory] 4,'Pakistani','Baryani, Qorma, Palau',1

-- =============================================
CREATE PROCEDURE [Product].[uspMarkCategoryActive]
    @pCategoryID	int	 
   ,@pProfileID		int
   ,@pIsActive		bit
AS
BEGIN
    DECLARE	@vActive nvarchar(max), 
			@vName nvarchar(max)

	set @vActive='active'	
	BEGIN TRY
    if(@pIsActive=0)
	begin
		set @vActive='inactive'		
	end
	   
    IF ISNULL(@pCategoryID,0) > 0
	BEGIN
	    SELECT @vName=name from  [Product].[tblCategory] where categoryID=@pCategoryID

		UPDATE [Product].[tblCategory]
	    SET
		   isActive=@pIsActive
		  ,[dateModified] = GETDATE()
		  ,[modifiedBy] = @pProfileID
	    WHERE categoryID=@pCategoryID


		
		 Insert into tblLogTimeline
				(profileID,dateCreated,dateModified,isActive,isDeleted,description)
				 Values (@pProfileID,GETDATE(),GETDATE(),1,0,'Marked food category <b>'+ @vName +'</b> ' +@vActive +'.')
	END
	
	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Product].[uspMarkDealActive]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 25/06/2018
-- Description:	Product Deal
-- Exec [Product].[uspMarkDealActive] 1,1,1

-- =============================================
CREATE PROCEDURE [Product].[uspMarkDealActive]
    @pDealID	int	 
   ,@pProfileID		int
   ,@pIsActive		bit
AS
BEGIN
    DECLARE	@vActive nvarchar(max), 
			@vName nvarchar(max)

	set @vActive='active'	
	BEGIN TRY
    if(@pIsActive=0)
	begin
		set @vActive='inactive'		
	end
	   
    IF ISNULL(@pDealID,0) > 0
	BEGIN
	    SELECT @vName=title from  [Product].[tblDeal] where dealID=@pDealID

		UPDATE [Product].[tblDeal]
	    SET
		   isActive=@pIsActive
		  ,[dateModified] = GETDATE()
		  ,[modifiedBy] = @pProfileID
	    WHERE  dealID=@pDealID


		
		 Insert into tblLogTimeline
				(profileID,dateCreated,dateModified,isActive,isDeleted,description)
				 Values (@pProfileID,GETDATE(),GETDATE(),1,0,'Marked deal <b>'+ @vName +'</b> ' +@vActive +'.')
	END
	
	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Product].[uspMarkMealActive_test]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 25/06/2018
-- Description:	Product Deal
-- Exec [Product].[uspMarkDealActive] 1,1,1

-- =============================================
CREATE PROCEDURE [Product].[uspMarkMealActive_test]
    @pMealID	int	 
   ,@pProfileID		int
   ,@pIsActive		bit
AS
BEGIN
    DECLARE	@vActive nvarchar(max), 
			@vName nvarchar(max)

	set @vActive='active'	
	BEGIN TRY
    if(@pIsActive=0)
	begin
		set @vActive='inactive'		
	end
	   
    IF ISNULL(@pMealID,0) > 0
	BEGIN
	    SELECT @vName=title from  [Product].[tblMeal] where MealID=@pMealID

		UPDATE [Product].[tblMeal]
	    SET
		   isActive=@pIsActive
		  ,[dateModified] = GETDATE()
		  ,[modifiedBy] = @pProfileID
	    WHERE  MealID=@pMealID


		
		 Insert into tblLogTimeline
				(profileID,dateCreated,dateModified,isActive,isDeleted,description)
				 Values (@pProfileID,GETDATE(),GETDATE(),1,0,'Marked meal <b>'+ @vName +'</b> ' +@vActive +'.')
	END
	
	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Product].[uspMarkMealItemActive]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 04/06/2018
-- Description:	Product Category
-- Exec [Product].[uspMarkMealItemActive] 1,1,1

-- =============================================
CREATE PROCEDURE [Product].[uspMarkMealItemActive]
    @pMealID	int	 
   ,@pProfileID		int
   ,@pIsActive		bit
AS
BEGIN
    DECLARE	@vActive nvarchar(max), 
			@vName nvarchar(max)

	set @vActive='active'	
	BEGIN TRY
    if(@pIsActive=0)
	begin
		set @vActive='inactive'		
	end
	   
    IF ISNULL(@pMealID,0) > 0
	BEGIN
	    SELECT @vName=title from  [Product].[tblMeal] where mealID=@pMealID

		UPDATE [Product].[tblMeal]
	    SET
		   isActive=@pIsActive
		  ,[dateModified] = GETDATE()
		  ,[modifiedBy] = @pProfileID
	    WHERE  mealID=@pMealID


		
		 Insert into tblLogTimeline
				(profileID,dateCreated,dateModified,isActive,isDeleted,description)
				 Values (@pProfileID,GETDATE(),GETDATE(),1,0,'Marked meal item <b>'+ @vName +'</b> ' +@vActive +'.')
	END
	
	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Product].[uspMarkMealItemFeatured]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 04/06/2018
-- Description:	Product Category
-- Exec [Product].[uspMarkMealItemActive] 1,1,1

-- =============================================
Create PROCEDURE [Product].[uspMarkMealItemFeatured]
    @pMealID	int	 
   ,@pProfileID		int
   ,@pIsActive		bit
AS
BEGIN
    DECLARE	@vActive nvarchar(max), 
			@vName nvarchar(max)

	set @vActive='feature'	
	BEGIN TRY
    if(@pIsActive=0)
	begin
		set @vActive='not featured'		
	end
	   
    IF ISNULL(@pMealID,0) > 0
	BEGIN
	    SELECT @vName=title from  [Product].[tblMeal] where mealID=@pMealID

		UPDATE [Product].[tblMeal]
	    SET
		   isFeature=@pIsActive
		  ,[dateModified] = GETDATE()
		  ,[modifiedBy] = @pProfileID
	    WHERE  mealID=@pMealID


		
		 Insert into tblLogTimeline
				(profileID,dateCreated,dateModified,isActive,isDeleted,description)
				 Values (@pProfileID,GETDATE(),GETDATE(),1,0,'Marked meal item <b>'+ @vName +'</b> ' +@vActive +'.')
	END
	
	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Product].[uspMarkMealItemSpeciality]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 04/06/2018
-- Description:	Product Category
-- Exec [Product].[uspMarkMealItemActive] 1,1,1

-- =============================================
Create PROCEDURE [Product].[uspMarkMealItemSpeciality]
    @pMealID	int	 
   ,@pProfileID		int
   ,@pIsActive		bit
AS
BEGIN
    DECLARE	@vActive nvarchar(max), 
			@vName nvarchar(max)

	BEGIN TRY
	   
    IF ISNULL(@pMealID,0) > 0
	BEGIN
	    SELECT @vName=title from  [Product].[tblMeal] where mealID=@pMealID

		UPDATE [Product].[tblMeal]
	    SET
		   isSpeciality=@pIsActive
		  ,[dateModified] = GETDATE()
		  ,[modifiedBy] = @pProfileID
	    WHERE  mealID=@pMealID

		set @vActive='Marked meal item <b>'+ @vName +'</b> as Speciality'	
	
		if(@pIsActive=0)
		begin
			set @vActive='Unmarked meal item  <b>'+ @vName +'</b> as Speciality'		
		end

		
		 Insert into tblLogTimeline
				(profileID,dateCreated,dateModified,isActive,isDeleted,description)
				 Values (@pProfileID,GETDATE(),GETDATE(),1,0, @vActive +'.')
	END
	
	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Product].[uspMarkSubCategoryActive]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 20/03/2018
-- Description:	Product Sub Category


-- =============================================
CREATE PROCEDURE [Product].[uspMarkSubCategoryActive]
    @pSubCategoryID	int	 
   ,@pProfileID		int
   ,@pIsActive		bit
AS
BEGIN
    DECLARE	@vActive nvarchar(max), 
			@vName nvarchar(max)

	set @vActive='active'	
	BEGIN TRY
    if(@pIsActive=0)
	begin
		set @vActive='inactive'		
	end
	   
    IF ISNULL(@pSubCategoryID,0) > 0
	BEGIN
	    SELECT @vName=name from  [Product].[tblSubCategory] where subCategoryID=@pSubCategoryID

		UPDATE [Product].[tblSubCategory]
	    SET
		   isActive=@pIsActive
		  ,[dateModified] = GETDATE()
		  ,[modifiedBy] = @pProfileID
	    WHERE subCategoryID=@pSubCategoryID


		
		 Insert into tblLogTimeline
				(profileID,dateCreated,dateModified,isActive,isDeleted,description)
				 Values (@pProfileID,GETDATE(),GETDATE(),1,0,'Marked food sub category <b>'+ @vName +'</b> ' +@vActive +'.')
	END
	
	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Product].[uspUpdateItemQuantity]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 04/06/2018
-- Description:	Product Meal
-- Exec [Product].[uspInsertUpdateMeal] null,'asdds','Baryani, Qorma, Palau',1
--select * from Product.tblOrder
--select * from Product.tblOrderItem
--select * from Lookup.tblOrderStatus
--select * from Product.tblOrderStatus
-- =============================================
CREATE PROCEDURE [Product].[uspUpdateItemQuantity]

    @pOrderItemID		int=null
   ,@pQuantity			int=null
   ,@pPrice				nvarchar(250)=null	
   ,@pTotalPrice	    nvarchar(250)=null	
	
     
AS
BEGIN
declare @vOrderID int

select @vOrderID=orderID from [Product].[tblOrderItem] where orderItemID=@pOrderItemID
	BEGIN TRY

			  Update [Product].[tblOrderItem]
			  set quantity=@pQuantity
			  ,@pPrice=@pPrice
			  where orderItemID=@pOrderItemID
	
				update [Product].[tblOrder]
				set price=@pTotalPrice
				where orderID=@vOrderID
	END TRY
	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Product].[uspUpdateOrderStatus]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 20/03/2018
-- Description:	Product Sub Category
-- Exec [Product].[uspDeleteSubCategory] 1,1


-- =============================================
CREATE PROCEDURE [Product].[uspUpdateOrderStatus]
    @pOrderID		int	 
   ,@pStatusID		int
   ,@pStatusDate    datetime=null
AS
BEGIN
	BEGIN TRY
    DECLARE	@vName nvarchar(max)
	   
    IF ISNULL(@pOrderID,0) > 0
	BEGIN

		UPDATE [Product].[tblOrder]
	    SET
		   orderLastStatusID=@pStatusID
		  ,[lastStatusDate] = GETDATE()
	    WHERE orderID=@pOrderID

		
					INSERT INTO [Product].[tblOrderStatus]
							   ([orderStatusID]
							   ,[orderID]
							   ,[orderStatusTypeID]
							   ,[isActive]
							   ,[isDeleted]
							   ,[dateModified]
							   ,[dateCreated])
				    Select Next Value for [dbo].[Seq_tblOrderStatus] 
							   ,@pOrderID
							   ,@pStatusID
							   ,1
							   ,0
							   ,GETDATE()
							   ,GETDATE()


   IF ISNULL(@pStatusID,0) = 7
   BEGIN
   	UPDATE [Product].[tblOrder]
	    SET [deliveryDate] = @pStatusDate
	    WHERE orderID=@pOrderID
   END
   ELSE
    BEGIN
   	UPDATE [Product].[tblOrder]
	    SET [deliveryDate] = null
	    WHERE orderID=@pOrderID
   END
		
	END
	
	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Product].[uspUpdatePaymentStatus]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 20/03/2018
-- Description: 
-- Exec [dbo].[uspChangeContactUsStatus] 

-- =============================================
CREATE PROCEDURE [Product].[uspUpdatePaymentStatus] 
    @pRequestID	int	 
   ,@pStatusID int
   ,@pIsPayed bit

AS
BEGIN
   

	BEGIN TRY

    IF ISNULL(@pRequestID,0) > 0
	BEGIN
	 
		UPDATE [Product].[featureRequest]
	    SET
		   requestStatusID=@pStatusID
		   ,payed=@pIsPayed
		  ,[dateModified] = GETDATE()
	    WHERE featureRequestID=@pRequestID


	END

	
	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Profile].[GetBuyerAddress]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 04/06/2018
-- Description:	Product Meal
-- Exec [Profile].[GetBuyerAddress] null,'asdds','Baryani, Qorma, Palau',1
--Select * from lookup.tblAddressType
-- =============================================
CREATE PROCEDURE [Profile].[GetBuyerAddress]

	@pBuyerID			int=null

AS
BEGIN
	BEGIN TRY
    DECLARE @vOrderID int
	DECLARE @vRecieptID int
	
			  SELECT
					pua.[addressID]
				   ,t.addressTypeID as addressTypeID
				   ,t.addressType as addressType
				   ,[profileID]
				   ,pua.[countryID]
				   ,pua.[cityID]
				   ,[postalCode]
				   ,[address]
				   ,lc.city
				   ,lco.country
				   ,pua.[isActive]
				   ,pua.[isDeleted]
			 FROM [Profile].[tblUserAddress] as pua
			 Inner join Lookup.tblCity as lc on lc.cityID=pua.cityID
			Inner join Lookup.tblCountry as lco on lco.countryID=pua.countryID
			Inner join Lookup.tblAddressType as t on t.addressTypeID=pua.addressTypeID
			 WHERE profileID=@pBuyerID

	END TRY
	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Profile].[uspAddSellerFeatureRequest]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 20/03/2018
-- Description:	Product Category
-- Exec  [Profile].[uspMarkSellerFeatureRequest]  1,1,0

-- =============================================
CREATE  PROCEDURE [Profile].[uspAddSellerFeatureRequest] 
     @pSellerID as int
	,@pStartDate as datetime
	,@pEndDate as datetime
	,@pAmount as int
	,@pNote as nvarchar(500)=null
AS
BEGIN
  BEGIN TRY


     INSERT INTO [Product].[featureRequest]
           ([featureRequestID]
           ,[profileID]
		              ,[dateFrom]
           ,[dateTo]

           ,[requestStatusID]
           ,[note]
           ,[isActive]
           ,[isDeleted]
           ,[dateCreated]
           ,[dateModified]
           ,[payed]
           ,[amountPayed])
     VALUES
           (Next Value for [dbo].[Seq_tblFeatureRequest] 
           ,@pSellerID
           ,@pStartDate
           ,@pEndDate
           ,1
           ,@pNote
           ,1
           ,0
           ,getdate()
           ,getdate()
           ,0
           ,@pAmount)

	
	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Profile].[uspAdminChangePassword]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 20/10/2015
-- Description:	User Login
-- Exec [Profile].[uspAdminChangePassword] 1,'CgumbG+yQieUWyDi3nSrhUj0BUVRr4Uf+SZgl7VoVmI='

-- =============================================
CREATE PROCEDURE [Profile].[uspAdminChangePassword]
				@pProfileID int,
				@pPassword nvarchar(max)

				 
AS
BEGIN
	BEGIN TRY
	 DECLARE @vCurrentDate date =Getdate() 

	 IF EXISTS (select 1 from Profile.tblUser (NoLock) where profileID=@pProfileID and IsDeleted = 0 AND IsActive = 1)
				BEGIN
					
						UPDATE Profile.tblUser
						SET [password]=@pPassword
						WHERE profileID=@pProfileID

						Insert into tblLogTimeline
						(profileID,dateCreated,dateModified,isActive,isDeleted,description)
						Values (@pProfileID,GETDATE(),GETDATE(),1,0,'Password Changed.')

				
				END 
	END TRY
	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Profile].[uspAdminUserLogin]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 20/03/2018
-- Description:	User Login
-- Exec [Profile].[uspAdminUserLogin] 'MachineSignature-001','::1','admin','CgumbG+yQieUWyDi3nSrhZdrPHpDthzDOl4eQkP3rK0='

-- =============================================
CREATE PROCEDURE [Profile].[uspAdminUserLogin]
				@pMachineSignature nvarchar(100),
				@pMachineIP nvarchar(100),
				@pUserName nvarchar(100),
				@pPassword nvarchar(max)
				 
AS
BEGIN
	BEGIN TRY
	 Declare @vProfileID int,@vRoleID int,
	 @vCurrentDate date =Getdate() 

	 select @vProfileID=pu.profileID,@vRoleID=pr.roleID
	 from Profile.tblUser (NOLOCK) pu
	 JOIN Profile.tblUserRole (NOLOCK) pr on pr.ProfileID = pu.ProfileID
	 where userName = @pUserName 
	   and password = @pPassword
	   and pu.isDeleted = 0		
	   and pr.RoleID in (1,2)	-- Admin and superAdmin Only
		

	if @vProfileID > 0
	BEGIN
		 IF EXISTS (select 1 from Profile.tblUser (NoLock) where UserName = @pUserName and Password = @pPassword and IsDeleted = 0 AND IsActive = 1)
				BEGIN
					
						Insert into tblLogLogin
						(profileID,loginDate,machineSignature,IPAddress,dateCreated,IsActive,IsDeleted,dateModified)
						Values  (@vProfileID,Getdate(),@pMachineSignature,@pMachineIP,Getdate(),1,0,Getdate())

						Insert into tblLogTimeline
						(profileID,dateCreated,dateModified,isActive,isDeleted,description)
						Values (@vProfileID,GETDATE(),GETDATE(),1,0,'Logged In.')
						
						Select 
						pu.profileID,
						pu.firstName,
						pu.middleName,
						pu.lastName,
						pu.DOB,
						pu.genderID,
						lg.name as gender,
						pu.maritalStatusID,
						lms.maritalStatusName,
						pu.mobile,
						pu.phoneNumber,
						pu.profilePhoto,
						pu.username,
						pu.titleID,
						lt.titleName,
						pu.email,
						pu.password,
						@vRoleID as roleID,
						0 as 'isSeller',
						(select roleName from Lookup.tblRole where roleID=@vRoleID) as role 
						from Profile.tblUser as pu 
						JOIN Lookup.tblGender as lg ON lg.genderID=pu.genderID
						JOIN Lookup.tblMaritalStatus as lms ON lms.maritalStatusID=pu.maritalStatusID
						JOIN Lookup.tblTitle as lt ON lt.titleID=pu.titleID
						where pu.profileID=@vProfileID

				
				END 
	END
	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Profile].[uspChangeSellerRegistrationStatus]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 20/03/2018
-- Description: 
-- Exec [Profile].[uspChangeSellerRegistrationStatus]  1,1,0

-- =============================================
CREATE PROCEDURE [Profile].[uspChangeSellerRegistrationStatus] 
    @pProfileID	int	 
   ,@pSellerID int
   ,@pAdminProfileID int
   ,@pRegistrationStatusID	int
AS
BEGIN
    DECLARE	@vStatusName nvarchar(max), 
			@vName nvarchar(max),
			@vAdminName nvarchar(max)

		
	BEGIN TRY

    Select @vStatusName=registrationStatus	from Lookup.tblRegisterationStatus where registrationStatusID=@pRegistrationStatusID	

	   
    IF ISNULL(@pProfileID,0) > 0
	BEGIN
	    SELECT @vName=username from  [Profile].[tblUser] where profileID=@pProfileID
		SELECT @vAdminName=firstName +' '+lastName from  [Profile].[tblUser] where profileID=@pAdminProfileID

		INSERT INTO [Profile].[tblSellerRegistrationStatus]
           ([sellerID]
           ,[registrationStatusID]
           ,[statusDate]
           ,[isActive]
           ,[isDeleted]
           ,[dateModified]
           ,[dateCreated]
		   ,[modifiedBy])
		VALUES
           (@pSellerID
           ,@pRegistrationStatusID
           ,GetDate()
           ,1
           ,0
           ,GetDate()
           ,GetDate()
		   ,@pAdminProfileID)

		UPDATE [Profile].[tblSeller]
	    SET
		   registrationStatusID=@pRegistrationStatusID
		  ,[dateModified] = GETDATE()
		  ,[modifiedBy] = @pAdminProfileID
	    WHERE profileID=@pProfileID


		
		 Insert into tblLogTimeline
				(profileID,dateCreated,dateModified,isActive,isDeleted,description)
				 Values (@pProfileID,GETDATE(),GETDATE(),1,0,@vAdminName+' updated registration status to '+@vStatusName +' of seller<b> '+ @vName +'</b>.')
	END
	
	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Profile].[uspCheckForEmailID]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 20/03/2018
-- Description:	check if email already exist
-- Exec [Profile].[uspCheckForEmailID] 'saadia@live.com'

-- =============================================
CREATE PROCEDURE [Profile].[uspCheckForEmailID]
				@pEmailID nvarchar(500)			 
AS
BEGIN
	BEGIN TRY
	 Declare @vProfileID int

	 select @vProfileID=pu.profileID
	 from Profile.tblUser (NOLOCK) pu
	 where pu.isDeleted = 0	and pu.email=@pEmailID
		
	
		 IF ISNULL(@vProfileID,0) > 0
				BEGIN
					SELECT '1'
				END 
		 ELSE 
				 BEGIN 
					SELECT '0' 
				 END
	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Profile].[uspClientChangePassword]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 20/10/2015
-- Description:	User Login
-- Exec [Profile].[uspAdminChangePassword] 1,'CgumbG+yQieUWyDi3nSrhUj0BUVRr4Uf+SZgl7VoVmI='

-- =============================================
CREATE PROCEDURE [Profile].[uspClientChangePassword]
				@pProfileID int,
				@pPassword nvarchar(max),
				@pOldPassword nvarchar(max)

				 
AS
BEGIN
	BEGIN TRY
	 DECLARE @vCurrentDate date =Getdate() 

		 IF EXISTS (select 1 from Profile.tblUser (NoLock) where profileID=@pProfileID and password=@pOldPassword  and IsDeleted = 0 AND IsActive = 1)
				BEGIN
					
						UPDATE Profile.tblUser
						SET [password]=@pPassword
						WHERE profileID=@pProfileID

						Insert into tblLogTimeline
						(profileID,dateCreated,dateModified,isActive,isDeleted,description)
						Values (@pProfileID,GETDATE(),GETDATE(),1,0,'Password Changed.')

				
				END 
		ELSE BEGIN 
			SELECT 2 -- Old Password incorrect
		END
	END TRY
	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Profile].[uspClientLogin]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 20/03/2018
-- Description:	Client Login
-- exec Profile.uspClientLogin @pMachineSignature=N'MachineSignature-Desktop',@pMachineIP=N'::1',@pUserName=N'nazia@msn.com',@pPassword=N'XxLlERJX33yaHvpnRMEB5A=='

-- =============================================
CREATE PROCEDURE [Profile].[uspClientLogin]
				@pMachineSignature nvarchar(100),
				@pMachineIP nvarchar(100),
				@pUserName nvarchar(100),
				@pPassword nvarchar(max)=null,
				@pAppID nvarchar(max)=null,
				@pIsGoogle bit=0,
				@pIsFacebook bit=0
				 
AS
BEGIN
	BEGIN TRY
	 Declare @vProfileID int,@vIsSeller bit,
	 @vCurrentDate date =Getdate() 

	  DECLARE @vTblRole TABLE  
	 (  
		userRoleID INT,  
		roleID INT
	 )   

	 select @vProfileID=pu.profileID
	 from Profile.tblUser (NOLOCK) pu
	 JOIN Profile.tblUserRole (NOLOCK) pr on pr.ProfileID = pu.ProfileID
	 where email = @pUserName 
	   and (password = @pPassword OR token=@pAppID)
	   and pu.isDeleted = 0		
	   and pr.RoleID not in (1,2)	-- Not Admin OR SuperAdmin 
		

	if @vProfileID > 0
	BEGIN
		 IF EXISTS (select 1 from Profile.tblUser (NoLock) where email = @pUserName and (Password= @pPassword OR (token=@pAppID and isGoogle=@pIsGoogle and isFacebook=@pIsFacebook))and IsDeleted = 0 AND IsActive = 1)
				BEGIN
					    INSERT INTO @vTblRole(userRoleID,roleID)
						SELECT userRoleID,roleID FROM Profile.tblUserRole where profileID=@vProfileID

						IF (SELECT count(*) FROM @vTblRole where roleID=3) > 0
						BEGIN
						   SET @vIsSeller=1
						END

						Insert into tblLogLogin
						(profileID,loginDate,machineSignature,IPAddress,dateCreated,IsActive,IsDeleted,dateModified)
						Values  (@vProfileID,Getdate(),@pMachineSignature,@pMachineIP,Getdate(),1,0,Getdate())

						Insert into tblLogTimeline
						(profileID,dateCreated,dateModified,isActive,isDeleted,description)
						Values (@vProfileID,GETDATE(),GETDATE(),1,0,'Logged In.')
						
						Select 
						ISNULL(@vIsSeller,0) 'isSeller',
						pu.profileID,
						pu.firstName,
						pu.middleName,
						pu.lastName,
						--pu.DOB,
						pu.genderID,
						lg.name as gender,
						pu.maritalStatusID,
						lms.maritalStatusName,
						pu.mobile,
						pu.phoneNumber,
						pu.profilePhoto,
						pu.username,
						pu.titleID,
						lt.titleName,
						pu.email,
						pu.password
						from Profile.tblUser as pu 
						LEFT OUTER JOIN  Lookup.tblGender as lg ON lg.genderID=pu.genderID
						LEFT OUTER JOIN Lookup.tblMaritalStatus as lms ON lms.maritalStatusID=pu.maritalStatusID
						LEFT OUTER JOIN  Lookup.tblTitle as lt ON lt.titleID=pu.titleID
						where pu.profileID=@vProfileID

				
				END 
	END
	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Profile].[uspDeleteAdminUser]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 20/03/2018
-- Description:	Delete Buyer 
-- Exec [Product].[uspDeleteAdminUser] 1,1


-- =============================================
CREATE PROCEDURE [Profile].[uspDeleteAdminUser]
    @pProfileID		int	 
   ,@pAdminProfileID		int

AS
BEGIN
	BEGIN TRY
    DECLARE	@vName nvarchar(max), @vAdminName nvarchar(max)
	 
	   
    IF ISNULL(@pProfileID,0) > 0
	BEGIN
	    SELECT @vName=username from  [Profile].[tblUser] where profileID=@pProfileID
		SELECT @vAdminName=firstName +' '+lastName from  [Profile].[tblUser] where profileID=@pProfileID

	

				UPDATE [Profile].[tblUser]
				SET
				   isDeleted=1
				  ,[dateModified] = GETDATE()
				  ,[modifiedBy] = @pAdminProfileID
				WHERE profileID=@pProfileID

	
				UPDATE [Profile].[tblUserRole]
				SET
					isDeleted=1
				  ,[dateModified] = GETDATE()
				WHERE profileID=@pProfileID and roleID=2

		
		
		 Insert into tblLogTimeline
				(profileID,dateCreated,dateModified,isActive,isDeleted,description)
				 Values (@pProfileID,GETDATE(),GETDATE(),1,0, @vAdminName +' deleted an admin user <b>'+ @vName +'</b> profile.')
	END
	
	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Profile].[uspDeleteBuyerProfile]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 20/03/2018
-- Description:	Delete Buyer 
-- Exec [Product].[uspDeleteBuyerProfile] 1,1


-- =============================================
CREATE PROCEDURE [Profile].[uspDeleteBuyerProfile]
    @pProfileID	int	 
   ,@pAdminProfileID		int

AS
BEGIN
	BEGIN TRY
    DECLARE	@vName nvarchar(max), @vAdminName nvarchar(max), @vIsSeller bit
	 
	IF EXISTS (SELECT * FROM Profile.tblUserRole WHERE roleID=3 and profileID=@pProfileID and isDeleted=0)
	 BEGIN
	   SET @vIsSeller=1
	 END 
	   
    IF ISNULL(@pProfileID,0) > 0
	BEGIN
	    SELECT @vName=username from  [Profile].[tblUser] where profileID=@pProfileID
		SELECT @vAdminName=firstName +' '+lastName from  [Profile].[tblUser] where profileID=@pProfileID

		IF(@vIsSeller<>1)
		BEGIN
				UPDATE [Profile].[tblUser]
				SET
				   isDeleted=1
				  ,[dateModified] = GETDATE()
				  ,[modifiedBy] = @pAdminProfileID
				WHERE profileID=@pProfileID
		END
		ELSE
		BEGIN
				UPDATE [Profile].[tblUserRole]
				SET
					isDeleted=1
				  ,[dateModified] = GETDATE()
				WHERE profileID=@pProfileID and roleID=4
		END
		
		
		 Insert into tblLogTimeline
				(profileID,dateCreated,dateModified,isActive,isDeleted,description)
				 Values (@pProfileID,GETDATE(),GETDATE(),1,0, @vAdminName +' deleted a buyer <b>'+ @vName +'</b> profile.')
	END
	
	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Profile].[uspDeleteSellerProfile]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 20/03/2018
-- Description:	Product Category
-- Exec [Product].[uspDeleteSellerProfile] 1,1


-- =============================================
CREATE PROCEDURE [Profile].[uspDeleteSellerProfile]
    @pProfileID	int	 
   ,@pAdminProfileID		int

AS
BEGIN
	BEGIN TRY
    DECLARE	@vName nvarchar(max), @vAdminName nvarchar(max), @vIsBuyer bit
	 
	IF EXISTS (SELECT * FROM Profile.tblUserRole WHERE roleID=4 and profileID=@pProfileID and isDeleted=0)
	 BEGIN
	   SET @vIsBuyer=1
	 END 
	   
    IF ISNULL(@pProfileID,0) > 0
	BEGIN
	    SELECT @vName=username from  [Profile].[tblUser] where profileID=@pProfileID
		SELECT @vAdminName=firstName +' '+lastName from  [Profile].[tblUser] where profileID=@pProfileID

		IF(@vIsBuyer<>1)
		BEGIN
				UPDATE [Profile].[tblUser]
				SET
				   isDeleted=1
				  ,[dateModified] = GETDATE()
				  ,[modifiedBy] = @pAdminProfileID
				WHERE profileID=@pProfileID
		END
		ELSE
		BEGIN
				UPDATE [Profile].[tblUserRole]
				SET
					isDeleted=1
				  ,[dateModified] = GETDATE()
				WHERE profileID=@pProfileID and roleID=3
		END
		

		UPDATE [Profile].[tblSeller]
	    SET
		   isDeleted=1
		  ,[dateModified] = GETDATE()
		  ,[modifiedBy] = @pAdminProfileID
	    WHERE profileID=@pProfileID


		
		 Insert into tblLogTimeline
				(profileID,dateCreated,dateModified,isActive,isDeleted,description)
				 Values (@pProfileID,GETDATE(),GETDATE(),1,0, @vAdminName +' deleted a seller <b>'+ @vName +'</b> profile.')
	END
	
	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Profile].[uspGetAdminUserByID]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 10/04/2018
-- Description:	Profile Buyer by ID
-- Exec [Profile].[uspGetAdminUserByID] 1007

-- =============================================
CREATE PROCEDURE [Profile].[uspGetAdminUserByID]
				@pProfileID int	 
AS
BEGIN
	BEGIN TRY

	SELECT [profileID]
      ,[username]
      ,[password]
      ,[firstName]
      ,[lastName]
      ,[mobile]
      ,[profilePhoto]
      ,pu.[isActive]
      ,pu.[isDeleted]
      ,pu.[dateModified]
      ,pu.[dateCreated]
      ,[email]
	FROM  [Profile].[tblUser] (NOLOCK) as pu
	WHERE  pu.profileID = @pProfileID


	--select addressID
	--    ,pua.addressTypeID
	--	,addressType
	--    ,address 
	--	,pua.countryID
	--	,lco.country
	--	,pua.cityID
	--	,lc.city
	--	,pua.postalCode
	--    from Profile.tblUserAddress as pua
	--	Inner join Lookup.tblCity as lc on lc.cityID=pua.cityID
	--	Inner join Lookup.tblCountry as lco on lco.countryID=pua.countryID
	--	Inner join Lookup.tblAddressType as at on at.addressTypeID=pua.addressTypeID
	--	where profileID=@pProfileID
	--	--and addressTypeID=4 
	--	and pua.isActive=1 
	--	and pua.isDeleted=0 

	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Profile].[uspGetAllAdminUser]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 09/04/2018
-- Description:	User - Seller
-- Exec [Profile].[uspGetAllAdminUser] '',0,10,'firstname','1'

-- =============================================
CREATE PROCEDURE [Profile].[uspGetAllAdminUser]

				@pSearchText				NVARCHAR(500),
				@pPageNumber				INT = 1,
				@pPageSize					INT = 15,
				@pSortColumn     			NVARCHAR(250) = NULL,
				@pSortColumnIndex			TINYINT=0
				 
AS
BEGIN
	BEGIN TRY
	DECLARE		@Query			nvarchar(max),
				@vCriteria		nVarchar(Max),
				@vOrderBy		nvarchar(max),
				@vSortColumn	nvarchar(max),
				@curDate		date = getdate(),
				@vCriteria1		nVarchar(Max)

	IF (ISNULL(@pPageNumber,0) = 0) SET @pPageNumber=1  
	IF (ISNULL(@pPageSize,0) = 0)  SET @pPageSize=10  
		
	IF(@pSortColumnIndex < 1)  
		SET @vSortColumn = ' ASC'  
	ELSE  
		SET @vSortColumn = ' DESC'

	SET @vSortColumn = @pSortColumn + @vSortColumn
	Set @vCriteria	 = ' WHERE pu.isDeleted=0  and pu.profileID in (select DISTINCT profileID from profile.tblUserRole where RoleID in (2) and isDeleted=0) '
	IF isnull(@pSearchText,'')<>'' SET @vCriteria = @vCriteria + Char(13) + 'and (email like ''%' + @pSearchText + '%'' OR firstname like ''%' + @pSearchText + '%'' OR lastname like ''%' + @pSearchText + '%'' )'


	SET @vOrderBy =' ORDER BY '+ @vSortColumn + Char(13)
	SET @vOrderBy =@vOrderBy+ ' OFFSET ( '+Cast(@pPageSize as nvarchar(20)) +'* ( '+Cast(@pPageNumber as nvarchar(20))+'-1)) ROWS'+Char(13)
	SET @vOrderBy =@vOrderBy+  ' FETCH NEXT '+ Cast(@pPageSize as nvarchar(20)) +' ROWS ONLY	'+Char(13)

	SET @Query = ' SELECT Row_number() over (order by ' + @vSortColumn+' ) as RowNum	
		  ,pu.[profileID]
		  ,[username]
		  ,[firstName]
		  ,[lastName]
		  ,[mobile]
		  ,[email]
		  ,[isActive]
		  ,Count(1) over()	AS TotalRecords 
	FROM  [Profile].[tblUser]  (NOLOCK) as pu'++Char(13)+@vCriteria+@vOrderBy
	
	Print substring(@Query , 0 , 4000)
	Exec sp_executesql @Query

	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Profile].[uspGetBuyerByID]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 10/04/2018
-- Description:	Profile Buyer by ID
-- Exec [Profile].[uspGetBuyerByID] 4

-- =============================================
CREATE PROCEDURE [Profile].[uspGetBuyerByID]
				@pProfileID int	 
AS
BEGIN
	BEGIN TRY

	SELECT [profileID]
      ,[username]
      ,[password]
      ,[firstName]
      ,[middleName]
      ,[lastName]
      ,[mobile]
      ,[phoneNumber]
      ,pu.[titleID]
	  ,lt.titleName
      ,isnull(pu.[genderID],0) as genderID
	  ,lg.name  as 'gender'
      ,isnull(pu.[maritalStatusID],0) as maritalStatusID
	  ,maritalStatusName
	  ,profilePhoto
	  ,pu.middleName
      ,[DOB]
      ,[profilePhoto]
      ,pu.[isActive]
      ,pu.[isDeleted]
      ,pu.[dateModified]
      ,pu.[dateCreated]
      ,[email]
    --  ,[modifiedBy]
	FROM  [Profile].[tblUser] (NOLOCK) as pu
	left outer join [Lookup].[tblTitle] (NOLOCK) as lt ON lt.titleID=pu.titleID 
	left outer join [Lookup].[tblMaritalStatus] (NOLOCK) as lms ON lms.maritalStatusID=pu.maritalStatusID 
	left outer  join [Lookup].[tblGender] (NOLOCK) as lg ON lg.genderID=pu.genderID 
	WHERE  pu.profileID = @pProfileID


	select addressID
	    ,pua.addressTypeID
		,addressType
	    ,address 
		,pua.countryID
		,lco.country
		,pua.cityID
		,lc.city
		,pua.postalCode
	    from Profile.tblUserAddress as pua
		Inner join Lookup.tblCity as lc on lc.cityID=pua.cityID
		Inner join Lookup.tblCountry as lco on lco.countryID=pua.countryID
		Inner join Lookup.tblAddressType as at on at.addressTypeID=pua.addressTypeID
		where profileID=@pProfileID
		--and addressTypeID=4 
		and pua.isActive=1 
		and pua.isDeleted=0 

	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Profile].[uspGetBuyerDashboardOrders]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 4/06/2018
-- Description:	Order By ID
-- Exec [Profile].[uspGetBuyerDashboardOrders] 12

-- =============================================
CREATE PROCEDURE [Profile].[uspGetBuyerDashboardOrders]

				@pProfileID int	 
AS
BEGIN
	BEGIN TRY
       
	 SELECT Top 10
       ord.[orderID]
      ,ord.[sellerProfileID]
      ,ord.[buyerProfileID]
	  ,sel.displayTitle
	  ,sel.FolderID
	  ,pro.firstName +' '+ pro.lastName  seller
	  ,ISNULL(sel.logo,sel.bannarPhoto) as photo
	  ,ord.deliveryDate
	  ,ord.orderDate
      ,ord.deliveryAddress
      ,ord.[quantity]
      ,ord.[ratingID]
      ,rat.[description]
      ,ord.[comment]
      ,ord.[orderLastStatusID]
      ,[stat].[status]
      ,ord.[price]
      ,ord.[paymentDone]
	  ,ord.recieptNumber
      ,ord.[isActive]
      ,ord.[isDeleted]
	  ,Count(1) over()	AS TotalRecords 
	  FROM [Product].[tblOrder] as ord
	  Inner join [Profile].[tblSeller] as sel ON sel.profileID=ord.sellerProfileID
      Inner join [Profile].[tblUser] as pro ON pro.profileID=ord.sellerProfileID
	  LEFT OUTER join [Lookup].[tblRating] as rat ON rat.ratingID=ord.ratingID
	  LEFT OUTER join [Lookup].[tblOrderStatus] as stat ON stat.orderStatusID= ord.orderLastStatusID
 WHERE  ord.buyerProfileID=@pProfileID and ord.orderLastStatusID<>9
 ORDER BY orderDate DESC


 END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Profile].[uspGetBuyerFavourite]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 10/04/2018
-- Description:	Profile Buyer by ID
-- Exec [Profile].[uspGetBuyerFavourite] 13

-- =============================================
CREATE PROCEDURE [Profile].[uspGetBuyerFavourite]
				@pProfileID int	 
AS
BEGIN
	BEGIN TRY

	
	SELECT 
	  --[userfavouriteID]
		  ISNULL(ps.[profileID],0) as sellerProfileID
		   ,ISNULL(ps.[profileID],0) as profileID
		,ISNULL([displayTitle],'') as displayTitle 
		,ISNULL([displayTitle],'') as title 
	 -- ,ISNULL(ps.logo,ps.bannarPhoto) as bannarPhoto
	   ,ISNULL(ps.FolderID,0) as FolderID
			  ,ISNULL(ps.logo,'') as logo
			  ,ISNULL(ps.avgRating,0) as avgRating
			  ,ISNULL(ps.ratedCount,0) as ratedCount
			  ,ISNULL(ps.bannarPhoto,'') as bannarPhoto
			  ,ISNULL(pu.profilePhoto,'') as profilePhoto
			  ,ISNULL(ps.description,'') as description
			  ,ISNULL(pua.address,'') as lineAddress
			  ,ISNULL(ps.deliveryRange,'') as deliveryRange
			  ,ISNULL(ps.offerDelivery,0) as offerDelivery
			  --,cty.currency as currencyID
			  ,ISNULL(cur.sign,'') as currency
			  ,ISNULL(dis.unit,'') as unit
			  --,cit.city
			  --,pua.postalCode
      ,uf.[isActive]
      ,uf.[isDeleted]
      ,uf.[dateModified]
      ,uf.[dateCreated]
   FROM [Profile].[tblUserFavourites] as uf
   inner join [Profile].[tblUser] (NOLOCK) as pu ON pu.profileID = uf.sellerProfileID
   inner join [Profile].[tblSeller] (NOLOCK) as ps ON ps.profileID = uf.sellerProfileID
   left outer  join Profile.tblUserAddress as pua ON pua.profileID=ps.profileID and pua.addressTypeID=4 and pua.isActive=1 and pua.isDeleted=0
	 left outer  join Lookup.tblCountry as cty ON cty.countryID=pua.countryID
	 left outer  join Lookup.tblCity as cit ON cit.countryID=pua.countryID
	 inner join Lookup.tblCurrency as cur ON cur.currencyID=cty.currency
	 inner join Lookup.tblDistanceUnit as dis ON dis.unitID=cty.distanceUnitID
   WHERE  uf.buyerProfileID = @pProfileID AND uf.isActive=1 and uf.isDeleted=0

    


	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END
GO
/****** Object:  StoredProcedure [Profile].[uspGetBuyerFavourits]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 10/04/2018
-- Description:	Profile Buyer by ID
-- Exec [Profile].[uspGetBuyerFavourite] 4
-- SELECT * FROM LOOKUP.tblAddressType

-- =============================================
CREATE PROCEDURE [Profile].[uspGetBuyerFavourits]
				@pProfileID int	 
AS
BEGIN
	BEGIN TRY

	
	SELECT [userfavouriteID]
      ,[sellerProfileID]
	  ,[firstName]+' '+[lastName] as 'seller'
	  ,[displayTitle] as 'title'
      ,[buyerProfileID]
      ,uf.[isActive]
      ,uf.[isDeleted]
      ,uf.[dateModified]
      ,uf.[dateCreated]
	  ,cty.currency as currencyID
	 ,cur.sign as currency
	 ,ps.deliveryRange as deliveryRange
	 ,ps.offerDelivery as offerDelivery
	 ,dis.unit
   FROM [Profile].[tblUserFavourites] as uf
   inner join [Profile].[tblUser] (NOLOCK) as pu ON pu.profileID = uf.sellerProfileID
   inner join [Profile].[tblSeller] (NOLOCK) as ps ON ps.profileID = uf.sellerProfileID
     left outer  join Profile.tblUserAddress as pua ON pua.profileID=uf.sellerProfileID AND addressTypeID=4
	 left outer  join Lookup.tblCountry as cty ON cty.countryID=pua.countryID
	  inner join Lookup.tblDistanceUnit as dis ON dis.unitID=cty.distanceUnitID
	 inner join Lookup.tblCurrency as cur ON cur.currencyID=cty.currency
   WHERE  uf.buyerProfileID = @pProfileID AND uf.isActive=1 and uf.isDeleted=0


	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Profile].[uspGetBuyerOrderHistory]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 20/03/2018
-- Description:	Product Order
-- Exec  [Product].[uspGetAllOrders] null,0,0,0,0,1,15,'displayTitle',1,null

-- =============================================
CREATE PROCEDURE [Profile].[uspGetBuyerOrderHistory]

				@pSearchText				NVARCHAR(500) =NULL,
				@pProfileID				   int =0,
				@pRatingID				   int =0,
				@pSellerID				   int =0,
				@pOrderStatusID				int=0,
				@pPageNumber				INT = 1,
				@pPageSize					INT = 15,
				@pSortColumn     			NVARCHAR(250) = NULL,
				@pSortColumnIndex			TINYINT=0,
				@pOrderDate				    DateTime =NULL
				 
AS
BEGIN
	BEGIN TRY
	DECLARE		@Query			nvarchar(max),
				@vCriteria		nVarchar(Max),
				@vOrderBy		nvarchar(max),
				@vSortColumn	nvarchar(max),
				@curDate		date = getdate(),
				@vCriteria1		nVarchar(Max)

	IF (ISNULL(@pPageNumber,0) = 0) SET @pPageNumber=1  
	IF (ISNULL(@pPageSize,0) = 0)  SET @pPageSize=10  
		
	IF(@pSortColumnIndex < 1)  
		SET @vSortColumn = ' ASC'  
	ELSE  
		SET @vSortColumn = ' DESC'

	SET @vSortColumn = @pSortColumn + @vSortColumn
	Set @vCriteria	 = ' WHERE  ord.isDeleted=0 and ord.orderLastStatusID <> 9'

    IF isnull(@pProfileID,0 )<> 0 SET @vCriteria = @vCriteria + Char(13) + 'and ord.buyerProfileID = ' +  Cast(@pProfileID as nvarchar(20)) 
	IF isnull(@pSellerID,0 )<> 0 SET @vCriteria = @vCriteria + Char(13) + 'and ord.sellerProfileID = '+  Cast(@pSellerID as nvarchar(20)) 
	IF isnull(@pRatingID,0 )<> 0 SET @vCriteria = @vCriteria + Char(13) + 'and ord.ratingID = '+  Cast(@pRatingID as nvarchar(20)) 
	IF isnull(@pOrderStatusID,0 )<> 0 SET @vCriteria = @vCriteria + Char(13) + 'and ord.OrderLastStatusID = '+  Cast(@pOrderStatusID as nvarchar(20))

	IF isnull(@pSearchText,'' )<> '' SET @vCriteria = @vCriteria + Char(13) + 'and (sel.displayTitle like ''%' + @pSearchText + '%'' OR pro.firstName like ''%' + @pSearchText + '%'' OR pro.lastName like ''%' + @pSearchText + '%'')'
	
	IF isnull(@pOrderDate,0 )<> 0 SET @vCriteria = @vCriteria + Char(13) + 'and CONVERT(date, ord.orderDate)= '''+  Cast(CONVERT(date, @pOrderDate) as nvarchar(20)) +''''
	


	SET @vOrderBy =' ORDER BY	1'+/*@vSortColumn*/+Char(13)
	SET @vOrderBy =@vOrderBy+ ' OFFSET ( '+Cast(@pPageSize as nvarchar(20)) +'* ( '+Cast(@pPageNumber as nvarchar(20))+'-1)) ROWS'+Char(13)
	SET @vOrderBy =@vOrderBy+  ' FETCH NEXT '+ Cast(@pPageSize as nvarchar(20)) +' ROWS ONLY	'+Char(13)

	SET @Query = ' SELECT Row_number() over (order by ' + @vSortColumn+' ) as RowNum		
      ,ord.[orderID]
      ,ord.[sellerProfileID]
      ,ord.[buyerProfileID]
	  ,sel.displayTitle
	  ,sel.FolderID
	  ,pro.firstName +'' ''+ pro.lastName  seller
	  ,buy.firstName +'' ''+ buy.lastName  buyer
	  ,ord.deliveryDate
	  ,CONVERT(date, ord.orderDate) as orderDate
	  -- ,ord.orderDate 
      ,ord.deliveryAddress
      ,ord.[quantity]
      ,ord.[ratingID]
      ,rat.[description] as rating
      ,ord.[comment]
      ,ord.[orderLastStatusID]
      ,status.[status]
      ,ord.[price]
      ,ord.[paymentDone]
	  ,ord.recieptNumber
      ,ord.[isActive]
      ,ord.[isDeleted]
	  ,Count(1) over()	AS TotalRecords 
	  FROM [Product].[tblOrder] as ord
	  Inner join [Profile].[tblSeller] as sel ON sel.profileID=ord.sellerProfileID
      Inner join [Profile].[tblUser] as pro ON pro.profileID=ord.sellerProfileID
	  Inner join [Profile].[tblUser] as buy ON buy.profileID=ord.buyerProfileID
	  Inner join [Lookup].[tblRating] as rat ON rat.ratingID=ord.ratingID
	  Inner join [Lookup].[tblOrderStatus] as status ON status.orderStatusID=ord.orderLastStatusID 
	'+ +Char(13)+@vCriteria+@vOrderBy
	
	Print substring(@Query , 0 , 4000)
	Exec sp_executesql @Query

	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Profile].[uspGetBuyers]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 09/04/2018
-- Description:	User - Seller
-- Exec [Profile].[uspGetBuyers] '',0,10,'firstname','1'
-- Exec [Profile].[uspGetSellers] '',0,10,'firstname','1'
--exec [Profile].[uspGetBuyers] @pSearchText=NULL,@pSortColumn=N' email',@pSortColumnIndex=0,@pPageNumber=1,@pPageSize=10

-- =============================================
CREATE PROCEDURE [Profile].[uspGetBuyers]

				@pSearchText				NVARCHAR(500),
				@pPageNumber				INT = 1,
				@pPageSize					INT = 15,
				@pSortColumn     			NVARCHAR(250) = NULL,
				@pSortColumnIndex			TINYINT=0
				 
AS
BEGIN
	BEGIN TRY
	DECLARE		@Query			nvarchar(max),
				@vCriteria		nVarchar(Max),
				@vOrderBy		nvarchar(max),
				@vSortColumn	nvarchar(max),
				@curDate		date = getdate(),
				@vCriteria1		nVarchar(Max)

	IF (ISNULL(@pPageNumber,0) = 0) SET @pPageNumber=1  
	IF (ISNULL(@pPageSize,0) = 0)  SET @pPageSize=10  
		
	IF(@pSortColumnIndex < 1)  
		SET @vSortColumn = ' ASC'  
	ELSE  
		SET @vSortColumn = ' DESC'

	SET @vSortColumn = @pSortColumn + @vSortColumn
	Set @vCriteria	 = ' WHERE pu.isDeleted=0  and pu.profileID in (select DISTINCT profileID from profile.tblUserRole where RoleID in (4) and isDeleted=0) '
	IF isnull(@pSearchText,'')<>'' SET @vCriteria = @vCriteria + Char(13) + 'and (email like ''%' + @pSearchText + '%'' OR firstname like ''%' + @pSearchText + '%'' OR lastname like ''%' + @pSearchText + '%'' )'


	SET @vOrderBy =' ORDER BY '+ @vSortColumn + Char(13)
	SET @vOrderBy =@vOrderBy+ ' OFFSET ( '+Cast(@pPageSize as nvarchar(20)) +'* ( '+Cast(@pPageNumber as nvarchar(20))+'-1)) ROWS'+Char(13)
	SET @vOrderBy =@vOrderBy+  ' FETCH NEXT '+ Cast(@pPageSize as nvarchar(20)) +' ROWS ONLY	'+Char(13)

	SET @Query = ' SELECT Row_number() over (order by ' + @vSortColumn+' ) as RowNum	
		  ,pu.[profileID]
		  ,isnull([username],'''') as username
		  ,isnull([firstName],'''') as firstName
		  ,isnull([lastName],'''') as lastName
		  ,isnull([mobile],'''') as mobile
		  ,isnull([phoneNumber],'''') as phoneNumber
		  ,isnull([titleID],0) as titleID
		  ,isnull(pu.[genderID],0) as genderID
		  ,isnull(lg.name,'''') as gender
		  ,isnull(pu.[maritalStatusID],0) as maritalStatusID
		  ,isnull(maritalStatusName,'''') as maritalStatusName
		  ,isnull([DOB],'''') as DOB
		  ,isnull([profilePhoto],'''') as profilePhoto
		  ,CASE WHEN EXISTS(select Top 1 isActive from profile.tblUserRole where roleID=4 and profileID=pu.profileID) THEN (select Top 1 isActive from profile.tblUserRole where roleID=4 and profileID=pu.profileID) ELSE pu.[isActive] END As isActive
		  ,isnull([email],'''') as email
		  ,(select address +'', ''+ city +'', '' + country
			from Profile.tblUserAddress as pua
			Inner join Lookup.tblCity as lc on lc.cityID=pua.cityID
			Inner join Lookup.tblCountry as lco on lco.countryID=pua.countryID
			where profileID=pu.profileID 
			and addressTypeID=4 
			and pua.isActive=1 and 
			pua.isDeleted=0) as [permanentAddress]
			,Count(1) over()	AS TotalRecords 
		--,(select count(*) from Profile.tblUser where isDeleted=0 and profileID in (select DISTINCT profileID from profile.tblUserRole where RoleID in (4)  and isActive=1 and isDeleted=0)) as TotalRecords
	FROM  [Profile].[tblUser]  (NOLOCK) as pu
	Left outer join [Lookup].[tblMaritalStatus] (NOLOCK) as lms ON lms.maritalStatusID=pu.maritalStatusID 
	Left outer join [Lookup].[tblGender] (NOLOCK) as lg ON lg.genderID=pu.genderID'++Char(13)+@vCriteria+@vOrderBy
	
	Print substring(@Query , 0 , 4000)
	Exec sp_executesql @Query

	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Profile].[uspGetFeaturedSellers]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 04/06/2018
-- Description:	Get All Seller List
-- Exec [Profile].[uspGetFeaturedSellers] '2019-03-25 15:08:53.163',2

-- =============================================
CREATE PROCEDURE [Profile].[uspGetFeaturedSellers]
	  @pCurrentDate datetime,
	  @pCountryID int
AS
BEGIN
	BEGIN TRY

	SELECT distinct profileID
	INTO #tblTempFeat
	from Product.featureRequest 
	where ( CONVERT(date, @pCurrentDate , 111) between CONVERT(date, dateFrom , 111) and CONVERT(date, dateTo , 111) )
	    
	 SELECT	   sellerID
		      ,ps.profileID
			  ,email
			  ,username
			  ,firstName
			  ,lastName
			 ,isNull(displayTitle,'Service Provider') as displayTitle
			 ,isnull(ps.FolderID,'') as FolderID
			  ,isnull(ps.logo,'') as logo
			  ,isnull(ps.avgRating,0) avgRating
			  ,isnull(ps.ratedCount,0) ratedCount
			  ,isnull(ps.bannarPhoto,'') as bannarPhoto
			  ,isnull(pu.profilePhoto,'') as profilePhoto
			  ,isnull(ps.description,'') as description
			  ,isnull(pua.address,'') as address
			  ,isnull(ps.deliveryRange,0) as deliveryRange
			  ,isnull(ps.offerDelivery,0) as offerDelivery
			  ,cur.sign as currency
			  ,dis.unit
	 FROM  Profile.tblSeller as ps 
	 left outer  join Profile.tblUser as pu ON pu.profileID=ps.profileID
	 left outer  join Profile.tblUserAddress as pua ON pua.profileID=ps.profileID and pua.addressTypeID=4 and pua.isActive=1 and pua.isDeleted=0
	 left outer  join Lookup.tblCountry as cty ON cty.countryID=pua.countryID
	 inner join Lookup.tblCurrency as cur ON cur.currencyID=cty.currency
	 inner join Lookup.tblDistanceUnit as dis ON dis.unitID=cty.distanceUnitID
	 WHERE pu.isDeleted=0 and pu.isActive=1 and pua.countryID=@pCountryID
	 and ps.profileID in (select * from #tblTempFeat)


	    drop table #tblTempFeat

	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Profile].[uspGetFeatureRequest]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 09/04/2018
-- Description:	User - Seller Feature Request
-- Exec [Profile].[uspGetFeatureRequest] '',0,10,'firstname','1'

-- =============================================
CREATE PROCEDURE [Profile].[uspGetFeatureRequest]

				@pSearchText				NVARCHAR(500),
				@pPageNumber				INT = 1,
				@pPageSize					INT = 15,
				@pSortColumn     			NVARCHAR(250) = NULL,
				@pSortColumnIndex			TINYINT=0
				 
AS
BEGIN
	BEGIN TRY
	DECLARE		@Query			nvarchar(max),
				@vCriteria		nVarchar(Max),
				@vOrderBy		nvarchar(max),
				@vSortColumn	nvarchar(max),
				@curDate		date = getdate(),
				@vCriteria1		nVarchar(Max)

	IF (ISNULL(@pPageNumber,0) = 0) SET @pPageNumber=1  
	IF (ISNULL(@pPageSize,0) = 0)  SET @pPageSize=10  
		
	IF(@pSortColumnIndex < 1)  
		SET @vSortColumn = ' ASC'  
	ELSE  
		SET @vSortColumn = ' DESC'

	SET @vSortColumn = @pSortColumn + @vSortColumn
	Set @vCriteria	 = ' WHERE pu.isDeleted=0'
	IF isnull(@pSearchText,'')<>'' SET @vCriteria = @vCriteria + Char(13) + 'and (email like ''%' + @pSearchText + '%'' OR displayTitle like ''%' + @pSearchText + '%'')'


	SET @vOrderBy =' ORDER BY '+ @vSortColumn + Char(13)
	SET @vOrderBy =@vOrderBy+ ' OFFSET ( '+Cast(@pPageSize as nvarchar(20)) +'* ( '+Cast(@pPageNumber as nvarchar(20))+'-1)) ROWS'+Char(13)
	SET @vOrderBy =@vOrderBy+  ' FETCH NEXT '+ Cast(@pPageSize as nvarchar(20)) +' ROWS ONLY	'+Char(13)

	SET @Query = ' SELECT  Row_number() over (order by ' + @vSortColumn+' ) as RowNum	
		  ,[sellerID]
		  ,pu.[profileID]
		  ,[firstName]
		  ,[username]
		  ,[lastName]
		  ,[email]
		  ,[isFeatured]
		  ,[workPhone]
		  ,[displayTitle]
		  ,pfr.requestStatusID
		  ,pu.profilePhoto
		  ,note
		  ,dateTo
		  ,dateFrom
		  ,lrs.title as requestStatus
		,Count(1) over()	AS TotalRecords 
	FROM  Product.featureRequest as pfr  
	inner join [Profile].[tblUser]  (NOLOCK) as pu ON pu.profileID=pfr.profileID
	inner join [Profile].[tblSeller] (NOLOCK) as ps ON ps.profileID=pu.profileID
	left outer  join [Lookup].[tblRequestStatus] (NOLOCK) as lrs ON lrs.requestStatusID=pfr.requestStatusID '++Char(13)+@vCriteria+@vOrderBy
	
	Print substring(@Query , 0 , 4000)
	Exec sp_executesql @Query

	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Profile].[uspGetLatestSellers]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 04/06/2018
-- Description:	Get All Seller List
-- Exec [Profile].[uspGetLatestSellers] '2019-03-25 15:08:53.163'

-- =============================================
CREATE PROCEDURE [Profile].[uspGetLatestSellers]
	 @pCountryID int
AS
BEGIN
	BEGIN TRY
	
	DECLARE @vTempIDs TABLE (ID int,mealID int)

	 SELECT	  top 8 sellerID
		      ,ps.profileID as profileID
			  ,email
			  ,username
			  ,firstName
			  ,lastName
			  ,isNull(displayTitle,'Service Provider') as displayTitle
			  ,isnull(ps.FolderID,'') as FolderID
			  ,isnull(ps.logo,'') as logo
			  ,isnull(ps.avgRating,0) avgRating
			  ,isnull(ps.ratedCount,0) ratedCount
			  ,isnull(ps.bannarPhoto,'') as bannarPhoto
			  ,isnull(pu.profilePhoto,'') as profilePhoto
			  ,isnull(ps.description,'') as description
			  ,isnull(pua.address,'') as address
			  ,isnull(ps.deliveryRange,0) as deliveryRange
			  ,isnull(ps.offerDelivery,0) as offerDelivery
			  ,cty.currency as currencyID
			  ,cur.sign as currency
			  ,dis.unit
	 INTO #tblTempFR
	 FROM 	Profile.tblSeller as ps 
	 left outer  join Profile.tblUser as pu ON pu.profileID=ps.profileID
	 left outer  join Profile.tblUserAddress as pua ON pua.profileID=ps.profileID and pua.addressTypeID=4 and pua.isActive=1 and pua.isDeleted=0
	 left outer  join Lookup.tblCountry as cty ON cty.countryID=pua.countryID
	 inner join Lookup.tblCurrency as cur ON cur.currencyID=cty.currency
	 inner join Lookup.tblDistanceUnit as dis ON dis.unitID=cty.distanceUnitID
	 WHERE pu.isDeleted=0 and pu.isActive=1 and pua.countryID=@pCountryID ORDER BY ps.dateCreated DESC


	 INSERT @vTempIDs 
	 SELECT TOP 1 profileID,mealID
	 FROM Product.tblMeal 
	 GROUP BY profileID,mealID
	 HAVING profileID in(select profileID from #tblTempFR)

	 --SELECT * FROM @vTempIDs 
	 SELECT * FROM #tblTempFR

	 SELECT TOP 3
	  ml.profileID
	 ,ml.mealID
	 ,ml.title 
	 ,ml.description
	 ,ml.photo
	 ,ml.price
	 FROM Product.tblMeal as ml
	 WHERE ml.mealID in(select mealID from @vTempIDs)


	 DROP TABLE #tblTempFR
	    

	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Profile].[uspGetPopularSellers]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 04/06/2018
-- Description:	Get All Seller List
-- Exec [Profile].[uspGetPopularSellers] '2019-03-25 15:08:53.163'

-- =============================================
CREATE PROCEDURE [Profile].[uspGetPopularSellers]
	  	 @pCountryID int
AS
BEGIN
	BEGIN TRY

	 SELECT	  top 3 sellerID
		      ,ps.profileID
			  ,email
			  ,username
			  ,firstName
			  ,lastName
			  ,isNull(displayTitle,'Service Provider') as displayTitle
			 ,isnull(ps.FolderID,'') as FolderID
			  ,isnull(ps.logo,'') as logo
			  ,isnull(ps.avgRating,0) avgRating
			  ,isnull(ps.ratedCount,0) ratedCount
			  ,isnull(ps.bannarPhoto,'') as bannarPhoto
			  ,isnull(pu.profilePhoto,'') as profilePhoto
			  ,isnull(ps.description,'') as description
			  ,isnull(pua.address,'') as address
			  ,isnull(ps.deliveryRange,0) as deliveryRange
			  ,isnull(ps.offerDelivery,0) as offerDelivery
			  ,cty.currency as currencyID
			  ,cur.sign as currency
			  ,dis.unit
	 FROM Profile.tblSeller as ps 
	 left outer  join Profile.tblUser as pu ON pu.profileID=ps.profileID
	 left outer  join Profile.tblUserAddress as pua ON pua.profileID=ps.profileID and pua.addressTypeID=4 and pua.isActive=1 and pua.isDeleted=0
	  left outer  join Lookup.tblCountry as cty ON cty.countryID=pua.countryID
	 inner join Lookup.tblCurrency as cur ON cur.currencyID=cty.currency
	 inner join Lookup.tblDistanceUnit as dis ON dis.unitID=cty.distanceUnitID
	 WHERE pu.isDeleted=0 and pu.isActive=1 and pua.countryID=@pCountryID Order by ps.ratedCount,ps.avgRating DESC
	    

	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Profile].[uspGetSellerAccountInfo]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 10/04/2018
-- Description:	Profile seller by ID
-- Exec [Profile].[uspGetSellerAccountInfo] 3

-- =============================================
CREATE PROCEDURE [Profile].[uspGetSellerAccountInfo]
				@pProfileID int	 
AS
BEGIN
	BEGIN TRY
  
  
    SELECT [sellerID]
      ,ps.[profileID]
      ,bankName
	  ,accountTitle
	  ,accountNumber
	FROM  [Profile].[tblSeller] (NOLOCK) as ps
	WHERE  ps.profileID = @pProfileID

	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Profile].[uspGetSellerAddressHistory]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 10/04/2018
-- Description:	Profile seller by ID
-- Exec [Profile].[uspGetSellerAddressHistory] 1

-- =============================================
CREATE PROCEDURE [Profile].[uspGetSellerAddressHistory]
				@pProfileID int	 
AS
BEGIN
	BEGIN TRY
  
		SELECT [addressID]
		  ,pua.[addressTypeID]
		  ,addressType
		  ,[profileID]
		  ,pua.[countryID]
		  ,lco.country
		  ,lci.city
		  ,pua.[cityID]
		  ,[postalCode]
		  ,[address]
		  ,pua.[isActive]
		  ,pua.[isDeleted]
		  ,pua.[dateModified]
		  ,pua.[dateCreated]
		FROM [Profile].[tblUserAddress] pua
		Inner join Lookup.tblAddressType lat on lat.addressTypeID=pua.addressTypeID
		Inner join Lookup.tblCountry lco on lco.countryID=pua.countryID
		Inner join Lookup.tblCity lci on lci.cityID=pua.cityID
		WHERE  pua.profileID = @pProfileID 

	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Profile].[uspGetSellerByID]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 10/04/2018
-- Description:	Profile seller by ID
-- Exec [Profile].[uspGetSellerByID] 3

-- =============================================
CREATE PROCEDURE [Profile].[uspGetSellerByID]
				@pProfileID int	 
AS
BEGIN
	BEGIN TRY
  
  
    SELECT [sellerID]
      ,ps.[profileID]
      ,ISNULL([NICNumber],'') as 'NICNumber'
      ,[nationality]
      ,[religion]
      ,ISNULL([age],0) as 'age'
	  ,ISNULL([isFeatured],0) as 'isFeatured'
      ,ISNULL([isTopSeller],0) as 'isTopSeller'
      ,[bannarPhoto]
	  ,logo
      ,[workPhone]
      ,[deliveryRange]
      ,ps.[registrationStatusID]
	  ,lrs.registrationStatus
	  ,FolderID
	  ,ISNULL([offerDelivery],0) as 'offerDelivery'
	  ,[displayTitle]
      ,[description]
      ,ISNULL([recordModified],0) as 'recordModified'
      ,ISNULL([modificationVerified],0) as 'modificationVerified'
	  ,isnull(ratedCount,0) as ratedCount
	  ,isnull(avgRating,0) as avgRating
	FROM  [Profile].[tblSeller] (NOLOCK) as ps
	inner join [Lookup].[tblRegisterationStatus] (NOLOCK) as lrs ON lrs.registrationStatusID=ps.registrationStatusID
	WHERE  ps.profileID = @pProfileID


	SELECT [profileID]
      ,[username]
      ,[password]
      ,[firstName]
      ,[middleName]
      ,[lastName]
      ,[mobile]
      ,[phoneNumber]
      ,pu.[titleID]
	  ,lt.titleName
      ,pu.[genderID]
	  ,lg.name  as 'gender'
      ,pu.[maritalStatusID]
	  ,maritalStatusName
	  ,pu.middleName
      ,[DOB]
      ,[profilePhoto]
      ,pu.[isActive]
      ,pu.[isDeleted]
      ,pu.[dateModified]
      ,pu.[dateCreated]
      ,[email]
      ,[modifiedBy]
	FROM  [Profile].[tblUser] (NOLOCK) as pu
	left outer join [Lookup].[tblTitle] (NOLOCK) as lt ON lt.titleID=pu.titleID 
	left outer join [Lookup].[tblMaritalStatus] (NOLOCK) as lms ON lms.maritalStatusID=pu.maritalStatusID 
	left outer join [Lookup].[tblGender] (NOLOCK) as lg ON lg.genderID=pu.genderID 
	WHERE  pu.profileID = @pProfileID


	select addressID
	    ,address 
		,pua.countryID
		,lco.country
		,pua.cityID
		,lc.city
		,pua.postalCode
	    from Profile.tblUserAddress as pua
		Inner join Lookup.tblCity as lc on lc.cityID=pua.cityID
		Inner join Lookup.tblCountry as lco on lco.countryID=pua.countryID
		where profileID=@pProfileID
		and addressTypeID=4 
		and pua.isActive=1 
		and pua.isDeleted=0 

	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Profile].[uspGetSellerDashboardDeals]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 04/06/2018
-- Description:	Get All Seller List
-- Exec [Profile].[uspGetSellerDashboardMeals] 12

-- =============================================
CREATE PROCEDURE [Profile].[uspGetSellerDashboardDeals]
		@pProfileID int	 
AS
BEGIN
	BEGIN TRY
	

	 SELECT TOP 3
	  ml.profileID
	 ,ml.dealID
	 ,ml.title 
	 ,ml.description
	 ,ml.photo as photo
	 ,ml.price
	 ,sel.FolderID
	 ,cty.currency as currencyID
	 ,cur.sign as currency
	 FROM Product.tblDeal as ml
	  left outer  join Profile.tblSeller as sel ON sel.profileID=ml.profileID
	 left outer  join Profile.tblUserAddress as pua ON pua.profileID=ml.profileID
	 left outer  join Lookup.tblCountry as cty ON cty.countryID=pua.countryID
	 inner join Lookup.tblCurrency as cur ON cur.currencyID=cty.currency
	 WHERE ml.ProfileID=@pProfileID and ml.isDeleted=0 and ml.isActive=1
	 ORDER BY ml.dateCreated DESC


	 


	    

	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Profile].[uspGetSellerDashboardMeals]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 04/06/2018
-- Description:	Get All Seller List
-- Exec [Profile].[uspGetSellerDashboardMeals] 12

-- =============================================
CREATE PROCEDURE [Profile].[uspGetSellerDashboardMeals]
		@pProfileID int	 
AS
BEGIN
	BEGIN TRY
	


	
	 SELECT TOP 3
	  ml.profileID
	 ,ml.mealID
	 ,ml.title 
	 ,ml.description
	 ,ml.photo as photo
	 ,ml.price
	 ,sel.FolderID
	 ,cty.currency as currencyID
	 ,cur.sign as currency
	 FROM Product.tblMeal as ml
	 left outer  join Profile.tblSeller as sel ON sel.profileID=ml.profileID
	 left outer  join Profile.tblUserAddress as pua ON pua.profileID=ml.profileID
	 left outer  join Lookup.tblCountry as cty ON cty.countryID=pua.countryID
	 inner join Lookup.tblCurrency as cur ON cur.currencyID=cty.currency
	 WHERE ml.ProfileID=@pProfileID and ml.isDeleted=0 and ml.isActive=1
	 ORDER BY ml.dateCreated DESC


	 


	    

	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Profile].[uspGetSellerDetails]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 04/06/2018
-- Description:	Get All Seller List
-- Exec [Profile].[uspGetSellerDetails] 12

-- =============================================
CREATE PROCEDURE [Profile].[uspGetSellerDetails]
		@pProfileID int	 
AS
BEGIN
	BEGIN TRY
	

	 SELECT    sellerID
		      ,ps.profileID as profileID
			  ,isnull(email,'') as 'email'
			  ,isnull(username,'') as 'username'
			  ,isnull(firstName,'') as 'firstname'
			  ,isnull(lastName,'') as 'lastName'
			  ,isnull(displayTitle,'') as 'displayTitle'
			  ,isnull(ps.FolderID,'') as FolderID
			  ,isnull(ps.logo,'') as logo
			  ,isnull(ps.avgRating,0) as avgRating
			  ,isnull(ps.ratedCount,0) as ratedCount
			  ,isnull(ps.bannarPhoto,'') as bannarPhoto
			  ,isnull(pu.profilePhoto,'') as profilePhoto
			  ,isnull(ps.description,'') as description
			  ,isnull(pua.address,'') as address
			  ,isnull(ps.deliveryRange,'') as deliveryRange
			  ,isnull(ps.offerDelivery,0) as offerDelivery
			  ,isnull(cty.currency,0) as currencyID
			  ,isnull(cur.sign,'') as currency
			  ,isnull(dis.unit,'') as 'unit'
	 FROM Profile.tblSeller as ps 
	 left outer  join Profile.tblUser as pu ON pu.profileID=ps.profileID
	 left outer  join Profile.tblUserAddress as pua ON pua.profileID=ps.profileID and pua.addressTypeID=4 and pua.isActive=1 and pua.isDeleted=0
	 left outer  join Lookup.tblCountry as cty ON cty.countryID=pua.countryID
	 inner join Lookup.tblCurrency as cur ON cur.currencyID=cty.currency
	 inner join Lookup.tblDistanceUnit as dis ON dis.unitID=cty.distanceUnitID
	 WHERE pu.isDeleted=0 and pu.isActive=1 and pu.profileID=@pProfileID

	
	 SELECT 
	  ml.profileID
	 ,ml.mealID
	 ,ml.title 
	 ,ml.description
	 ,ml.photo as photo
	 ,ml.price
	 INTO #tempProMeal
	 FROM Product.tblMeal as ml
	 --left outer join product.tblGallery  as pgr ON pgr.galleryID=(select top 1 galleryID from product.tblGallery as pg where pg.mealID=ml.mealID and isDeleted=0 and isActive=1 )
	 WHERE ml.ProfileID=@pProfileID and ml.isDeleted=0 and ml.isActive=1

	  SELECT * FROM #tempProMeal

	 SELECT * 
	 FROM Product.tblMealTypes as m
	 inner join Lookup.tblMealType as t ON m.typeID=t.mealTypeID
	 WHERE m.mealID in (select mealID from #tempProMeal)


	  SELECT 
	  ml.profileID
	 ,ml.dealID
	 ,ml.title 
	 ,ml.description
	 ,ml.photo as photo
	 ,ml.price
	 FROM Product.tblDeal as ml
	 --left outer join product.tblGallery  as pgr ON pgr.galleryID=(select top 1 galleryID from product.tblGallery as pg where pg.mealID=ml.mealID and isDeleted=0 and isActive=1 )
	 WHERE ml.ProfileID=@pProfileID and ml.isDeleted=0 and ml.isActive=1
	 

	 DROP TABLE #tempProMeal
	    

	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Profile].[uspGetSellerDocuments]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 10/04/2018
-- Description:	Profile seller Attachments
-- Exec [Profile].[uspGetSellerDocuments] 1

-- =============================================
CREATE PROCEDURE [Profile].[uspGetSellerDocuments]
				@pProfileID int	 
AS
BEGIN
	BEGIN TRY

		SELECT [attachmentID]
			  ,pa.[folderTypeID]
			  ,lft.name as folderType
			  ,[folder]
			  ,[documentTitle]
			  ,[ext]
			  ,pa.name
			  ,[profileID]
			  ,pa.[isActive]
			  ,pa.[isDeleted]
			  ,pa.[dateModified]
			  ,pa.[dateCreated]
		  FROM [Profile].[tblAttachment] as pa (NOLOCK)
		  INNER JOIN Lookup.tblFolderType as lft (NOLOCK)  ON lft.folderTypeID=pa.folderTypeID
		  where profileID=@pProfileID
		  and pa.isActive=1 and pa.isDeleted=0

			

	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Profile].[uspGetSellerFeatureRequest]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 09/04/2018
-- Description:	User - Seller Feature Request
-- Exec  [Profile].[uspGetSellerFeatureRequest] '',12,0,10,'firstname','1'
--SELECT * FROM [Lookup].[tblPaymentStatus]

-- =============================================
CREATE PROCEDURE [Profile].[uspGetSellerFeatureRequest]

				@pSearchText				NVARCHAR(500),
				@pProfileID				INT = 1,
				@pPageNumber				INT = 1,
				@pPageSize					INT = 15,
				@pSortColumn     			NVARCHAR(250) = NULL,
				@pSortColumnIndex			TINYINT=0
				 
AS
BEGIN
	BEGIN TRY
	DECLARE		@Query			nvarchar(max),
				@vCriteria		nVarchar(Max),
				@vOrderBy		nvarchar(max),
				@vSortColumn	nvarchar(max),
				@curDate		date = getdate(),
				@vCriteria1		nVarchar(Max)

	IF (ISNULL(@pPageNumber,0) = 0) SET @pPageNumber=1  
	IF (ISNULL(@pPageSize,0) = 0)  SET @pPageSize=10  
		
	IF(@pSortColumnIndex < 1)  
		SET @vSortColumn = ' ASC'  
	ELSE  
		SET @vSortColumn = ' DESC'

	SET @vSortColumn = @pSortColumn + @vSortColumn
	Set @vCriteria	 = ' WHERE pu.isDeleted=0 and pu.profileID='+Cast(@pProfileID as nvarchar(20))
	IF isnull(@pSearchText,'')<>'' SET @vCriteria = @vCriteria + Char(13) + 'and (email like ''%' + @pSearchText + '%'' OR displayName like ''%' + @pSearchText + '%'')'


	SET @vOrderBy =' ORDER BY '+ @vSortColumn + Char(13)
	SET @vOrderBy =@vOrderBy+ ' OFFSET ( '+Cast(@pPageSize as nvarchar(20)) +'* ( '+Cast(@pPageNumber as nvarchar(20))+'-1)) ROWS'+Char(13)
	SET @vOrderBy =@vOrderBy+  ' FETCH NEXT '+ Cast(@pPageSize as nvarchar(20)) +' ROWS ONLY	'+Char(13)

	SET @Query = ' SELECT  Row_number() over (order by ' + @vSortColumn+' ) as RowNum	
		  ,[sellerID]
		  ,featureRequestID
		  ,pu.[profileID]
		  ,[firstName]
		  ,[username]
		  ,[lastName]
		  ,[email]
		  ,[isFeatured]
		  ,[workPhone]
		  ,[displayTitle]
		  ,pfr.requestStatusID
		  ,pu.profilePhoto
		  ,payed
		  ,amountPayed
		  ,note
		  ,dateTo
		  ,dateFrom
		  ,lrs.title as requestStatus
		,Count(1) over()	AS TotalRecords 
	FROM  Product.featureRequest as pfr  
	inner join [Profile].[tblUser]  (NOLOCK) as pu ON pu.profileID=pfr.profileID
	inner join [Profile].[tblSeller] (NOLOCK) as ps ON ps.profileID=pu.profileID
	left outer  join [Lookup].[tblPaymentStatus] (NOLOCK) as lrs ON lrs.paymentStatusID=pfr.requestStatusID '++Char(13)+@vCriteria+@vOrderBy
	
	Print substring(@Query , 0 , 4000)
	Exec sp_executesql @Query

	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Profile].[uspGetSellerOrderHistory]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 20/03/2018
-- Description:	Product Order
-- Exec  [Product].[uspGetAllOrders] null,0,0,0,0,1,15,'displayTitle',1,null

-- =============================================
CREATE PROCEDURE [Profile].[uspGetSellerOrderHistory]

				@pSearchText				NVARCHAR(500) =NULL,
				@pProfileID				   int =0,
				@pRatingID				   int =0,
				@pBuyerID				   int =0,
				@pOrderStatusID				int=0,
				@pPageNumber				INT = 1,
				@pPageSize					INT = 15,
				@pSortColumn     			NVARCHAR(250) = NULL,
				@pSortColumnIndex			TINYINT=0,
				@pOrderDate				    DateTime =NULL
				 
AS
BEGIN
	BEGIN TRY
	DECLARE		@Query			nvarchar(max),
				@vCriteria		nVarchar(Max),
				@vOrderBy		nvarchar(max),
				@vSortColumn	nvarchar(max),
				@curDate		date = getdate(),
				@vCriteria1		nVarchar(Max)

	IF (ISNULL(@pPageNumber,0) = 0) SET @pPageNumber=1  
	IF (ISNULL(@pPageSize,0) = 0)  SET @pPageSize=10  
		
	IF(@pSortColumnIndex < 1)  
		SET @vSortColumn = ' ASC'  
	ELSE  
		SET @vSortColumn = ' DESC'

	SET @vSortColumn = @pSortColumn + @vSortColumn
	Set @vCriteria	 = ' WHERE  ord.isDeleted=0 and ord.orderLastStatusID <> 9'

    IF isnull(@pBuyerID,0 )<> 0 SET @vCriteria = @vCriteria + Char(13) + 'and ord.buyerProfileID = ' +  Cast(@pBuyerID as nvarchar(20)) 
	IF isnull(@pProfileID,0 )<> 0 SET @vCriteria = @vCriteria + Char(13) + 'and ord.sellerProfileID = '+  Cast(@pProfileID as nvarchar(20)) 
	IF isnull(@pRatingID,0 )<> 0 SET @vCriteria = @vCriteria + Char(13) + 'and ord.ratingID = '+  Cast(@pRatingID as nvarchar(20)) 
	IF isnull(@pOrderStatusID,0 )<> 0 SET @vCriteria = @vCriteria + Char(13) + 'and ord.OrderLastStatusID = '+  Cast(@pOrderStatusID as nvarchar(20))

	IF isnull(@pSearchText,'' )<> '' SET @vCriteria = @vCriteria + Char(13) + 'and (sel.displayTitle like ''%' + @pSearchText + '%'' OR pro.firstName like ''%' + @pSearchText + '%'' OR pro.lastName like ''%' + @pSearchText + '%'')'
	
	IF isnull(@pOrderDate,0 )<> 0 SET @vCriteria = @vCriteria + Char(13) + 'and CONVERT(date, ord.orderDate)= '''+  Cast(CONVERT(date, @pOrderDate) as nvarchar(20)) +''''
	


	SET @vOrderBy =' ORDER BY	1'+/*@vSortColumn*/+Char(13)
	SET @vOrderBy =@vOrderBy+ ' OFFSET ( '+Cast(@pPageSize as nvarchar(20)) +'* ( '+Cast(@pPageNumber as nvarchar(20))+'-1)) ROWS'+Char(13)
	SET @vOrderBy =@vOrderBy+  ' FETCH NEXT '+ Cast(@pPageSize as nvarchar(20)) +' ROWS ONLY	'+Char(13)

	SET @Query = ' SELECT Row_number() over (order by ' + @vSortColumn+' ) as RowNum		
      ,ord.[orderID]
      ,ord.[sellerProfileID]
      ,ord.[buyerProfileID]
	  ,sel.displayTitle
	  ,sel.FolderID
	  ,pro.firstName +'' ''+ pro.lastName  seller
	  ,buy.firstName +'' ''+ buy.lastName  buyer
	  ,ord.deliveryDate
	  ,CONVERT(date, ord.orderDate) as orderDate
	  -- ,ord.orderDate 
      ,ord.deliveryAddress
      ,ord.[quantity]
      ,ord.[ratingID]
      ,rat.[description] as rating
      ,ord.[comment]
      ,ord.[orderLastStatusID]
      ,status.[status]
      ,ord.[price]
      ,ord.[paymentDone]
	  ,ord.recieptNumber
      ,ord.[isActive]
      ,ord.[isDeleted]
	  ,Count(1) over()	AS TotalRecords 
	  FROM [Product].[tblOrder] as ord
	  Inner join [Profile].[tblSeller] as sel ON sel.profileID=ord.sellerProfileID
      Inner join [Profile].[tblUser] as pro ON pro.profileID=ord.sellerProfileID
	  Inner join [Profile].[tblUser] as buy ON buy.profileID=ord.buyerProfileID
	  Inner join [Lookup].[tblRating] as rat ON rat.ratingID=ord.ratingID
	  Inner join [Lookup].[tblOrderStatus] as status ON status.orderStatusID=ord.orderLastStatusID 
	'+ +Char(13)+@vCriteria+@vOrderBy
	
	Print substring(@Query , 0 , 4000)
	Exec sp_executesql @Query

	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Profile].[uspGetSellerPersonalInfo]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 10/04/2018
-- Description:	Profile seller by ID
-- Exec [Profile].[uspGetSellerPersonalInfo] 3

-- =============================================
CREATE PROCEDURE [Profile].[uspGetSellerPersonalInfo]
				@pProfileID int	 
AS
BEGIN
	BEGIN TRY
  
  Declare @vProfileID int, @vDescription nvarchar(MAX)

    SELECT
		@vDescription=[description]
	FROM  [Profile].[tblSeller] (NOLOCK) as ps
	WHERE  ps.profileID = @pProfileID


	SELECT [profileID]
      ,[username]
      ,[password]
      ,[firstName]
      ,[middleName]
      ,[lastName]
      ,[mobile]
      ,[phoneNumber]
      ,ISNULL(pu.[titleID],0) as 'titleID'
	  ,lt.titleName
      ,ISNULL(pu.[genderID],0) as 'genderID'
	  ,lg.name  as 'gender'
	  ,@vDescription as 'description'
	  ,ISNULL(pu.[maritalStatusID],0) as 'maritalStatusID'
	  ,maritalStatusName
	  ,pu.middleName
      ,[DOB]
      ,[profilePhoto]
      ,pu.[isActive]
      ,pu.[isDeleted]
      ,pu.[dateModified]
      ,pu.[dateCreated]
      ,[email]
      ,ISNULL([modifiedBy],0) as 'modifiedBy'
	FROM  [Profile].[tblUser] (NOLOCK) as pu
	left outer join [Lookup].[tblTitle] (NOLOCK) as lt ON lt.titleID=pu.titleID 
	left outer join [Lookup].[tblMaritalStatus] (NOLOCK) as lms ON lms.maritalStatusID=pu.maritalStatusID 
	left outer join [Lookup].[tblGender] (NOLOCK) as lg ON lg.genderID=pu.genderID 
	WHERE  pu.profileID = @pProfileID


	select addressID
	    ,address 
		,pua.countryID
		,lco.country
		,pua.cityID
		,lc.city
		,pua.postalCode
	    from Profile.tblUserAddress as pua
		Inner join Lookup.tblCity as lc on lc.cityID=pua.cityID
		Inner join Lookup.tblCountry as lco on lco.countryID=pua.countryID
		where profileID=@pProfileID
		and addressTypeID=4 
		and pua.isActive=1 
		and pua.isDeleted=0 

	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Profile].[uspGetSellerRegistrationHistory]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 10/04/2018
-- Description:	Profile seller by ID
-- Exec [Profile].[uspGetSellerRegistrationHistory] 1

-- =============================================
CREATE PROCEDURE [Profile].[uspGetSellerRegistrationHistory]
				@pSellerID int	 
AS
BEGIN
	BEGIN TRY
  
		SELECT [sellerRegistrationID]
			  ,[sellerID]
			  ,psrs.[registrationStatusID]
			  ,registrationStatus
			  ,[statusDate]
			  ,psrs.[isActive]
			  ,psrs.[isDeleted]
			  ,psrs.[dateModified]
			  ,psrs.[dateCreated]
			  ,pu.username  as 'modifiedByName'
		FROM [Profile].[tblSellerRegistrationStatus] psrs
		Inner join Lookup.tblRegisterationStatus lrs on lrs.registrationStatusID=psrs.registrationStatusID
		Inner join Profile.tblUser pu on pu.profileID=psrs.modifiedBy
		WHERE  psrs.sellerID = @pSellerID 

	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Profile].[uspGetSellers]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 09/04/2018
-- Description:	User - Seller
-- Exec [Profile].[uspGetSellers] '',0,10,'firstname','1',0
--

-- =============================================
CREATE PROCEDURE [Profile].[uspGetSellers]

				@pSearchText				NVARCHAR(500),
				@pPageNumber				INT = 1,
				@pPageSize					INT = 15,
				@pSortColumn     			NVARCHAR(250) = NULL,
				@pSortColumnIndex			TINYINT=0,
				@pRegistrationID		    int=0 
				 
AS
BEGIN
	BEGIN TRY
	DECLARE		@Query			nvarchar(max),
				@vCriteria		nVarchar(Max),
				@vOrderBy		nvarchar(max),
				@vSortColumn	nvarchar(max),
				@curDate		date = getdate(),
				@vCriteria1		nVarchar(Max)

	IF (ISNULL(@pPageNumber,0) = 0) SET @pPageNumber=1  
	IF (ISNULL(@pPageSize,0) = 0)  SET @pPageSize=10  
		
	IF(@pSortColumnIndex < 1)  
		SET @vSortColumn = ' ASC'  
	ELSE  
		SET @vSortColumn = ' DESC'

	SET @vSortColumn = @pSortColumn + @vSortColumn
	
	Set @vCriteria	 = ' WHERE pu.isDeleted=0  and pu.profileID in (select DISTINCT profileID from profile.tblUserRole where RoleID in (3) and isDeleted=0) '
	IF isnull(@pRegistrationID,0 )<> 0 SET @vCriteria = @vCriteria + Char(13) + 'and ps.registrationStatusID = ' +  Cast(@pRegistrationID as nvarchar(20)) 
	IF isnull(@pSearchText,'')<>'' SET @vCriteria = @vCriteria + Char(13) + 'and (email like ''%' + @pSearchText + '%'' OR firstname like ''%' + @pSearchText + '%'' OR lastname like ''%' + @pSearchText + '%'' )'


	SET @vOrderBy =' ORDER BY '+ @vSortColumn + Char(13)
	SET @vOrderBy =@vOrderBy+ ' OFFSET ( '+Cast(@pPageSize as nvarchar(20)) +'* ( '+Cast(@pPageNumber as nvarchar(20))+'-1)) ROWS'+Char(13)
	SET @vOrderBy =@vOrderBy+  ' FETCH NEXT '+ Cast(@pPageSize as nvarchar(20)) +' ROWS ONLY	'+Char(13)

	SET @Query = ' SELECT Row_number() over (order by ' + @vSortColumn+' ) as RowNum	
		  ,[sellerID]
		  ,pu.[profileID]
		  ,isnull([firstName],'''') as firstName
		  ,isnull([lastName],'''') as lastName
		  ,isnull(lg.name,'''') as gender
		  ,isnull(ps.isActive,0) as  isActive
		 -- ,CASE WHEN EXISTS(select Top 1 isActive from profile.tblUserRole where roleID=4 and profileID=pu.profileID) THEN (select Top 1 isActive from profile.tblUserRole where roleID=3 and profileID=pu.profileID) ELSE pu.[isActive] END As isActive
		  ,isnull([NICNumber],'''') as NICNumber
		  ,isnull([nationality],'''') as nationality
		 --,[religion]
		  --,[age]
		  ,isnull([email],'''') as email
		  ,isnull([isFeatured],0) as isFeatured
		  ,isnull([isTopSeller],0) as isTopSeller
		  --,[workPhone]
		  ,isnull([deliveryRange],'''') as deliveryRange
		  ,isnull(ps.[registrationStatusID], 0 ) as registrationStatusID
		  ,isnull(lrs.registrationStatus,'''') as registrationStatus
		  ,isnull([offerDelivery],0) as offerDelivery
		  ,isnull([displayTitle],'''') as displayTitle
		  ,isnull([description],'''') as description
		  ,isnull([recordModified],0) as recordModified
		  ,isnull([modificationVerified],0) as modificationVerified
		  ,(select address +'', ''+ city +'', '' + country
			 from Profile.tblUserAddress as pua
			Inner join Lookup.tblCity as lc on lc.cityID=pua.cityID
			Inner join Lookup.tblCountry as lco on lco.countryID=pua.countryID
			where profileID=pu.profileID 
			and addressTypeID=4 
			and pua.isActive=1 and 
			pua.isDeleted=0) as [permanentAddress]
		,(select count(*) from Profile.tblSeller where isDeleted=0 and profileID in (select DISTINCT profileID from profile.tblUserRole where RoleID in (3) and isActive=1 and isDeleted=0)) as TotalRecords
	FROM  [Profile].[tblUser]  (NOLOCK) as pu
	inner join [Profile].[tblSeller] (NOLOCK) as ps ON ps.profileID=pu.profileID
	left outer  join [Lookup].[tblMaritalStatus] (NOLOCK) as lms ON lms.maritalStatusID=pu.maritalStatusID 
	left outer join [Lookup].[tblGender] (NOLOCK) as lg ON lg.genderID=pu.genderID 
	left outer join [Lookup].[tblRegisterationStatus] (NOLOCK) as lrs ON lrs.registrationStatusID=ps.registrationStatusID'++Char(13)+@vCriteria+@vOrderBy
	
	--Print substring(@Query , 0 , 4000)
	Exec sp_executesql @Query

	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Profile].[uspGetSellerWorkInfo]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 10/04/2018
-- Description:	Profile seller by ID
-- Exec [Profile].[uspGetSellerByID] 3

-- =============================================
CREATE PROCEDURE [Profile].[uspGetSellerWorkInfo]
				@pProfileID int	 
AS
BEGIN
	BEGIN TRY
  
  
    SELECT [sellerID]
      ,ps.[profileID]
      ,[NICNumber]
      ,[nationality]
      ,[bannarPhoto]
      ,[deliveryRange]
      ,[offerDelivery]
	  ,[displayTitle]
	FROM  [Profile].[tblSeller] (NOLOCK) as ps
	WHERE  ps.profileID = @pProfileID

	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Profile].[uspGetUserByEmailID]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 10/04/2018
-- Description:	Profile Buyer by ID
-- Exec [Profile].[uspGetBuyerByID] 4

-- =============================================
CREATE PROCEDURE [Profile].[uspGetUserByEmailID]
				@pEmailID varchar(100)	 
AS
BEGIN
	BEGIN TRY

SELECT [profileID]
      ,[username]
      ,[password]
      ,[firstName]
      ,[lastName]
      ,[mobile]
      ,[profilePhoto]
      ,pu.[isActive]
      ,pu.[isDeleted]
      ,pu.[dateModified]
      ,pu.[dateCreated]
      ,[email]
	FROM  [Profile].[tblUser] (NOLOCK) as pu
	WHERE  pu.email = @pEmailID
	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Profile].[uspInsertDeliveryAddress]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 04/06/2018
-- Description:	Product Meal
-- Exec [Product].[uspInsertUpdateMeal] null,'asdds','Baryani, Qorma, Palau',1
--Select * from lookup.tblAddressType
-- =============================================
CREATE PROCEDURE [Profile].[uspInsertDeliveryAddress]

	@pBuyerID			int=null
   --,@pAddressTypeID			int=null
   ,@pCountryID			int=null
   ,@pCityID			int=null
   ,@pAddress	nvarchar(max)=null
   ,@pPostCode		    nvarchar(max)=null

	
     
AS
BEGIN
	BEGIN TRY
    DECLARE @vOrderID int
	DECLARE @vRecieptID int
	
			  INSERT INTO [Profile].[tblUserAddress]
				   (
					[addressID]
				   ,[addressTypeID]
				   ,[profileID]
				   ,[countryID]
				   ,[cityID]
				   ,[postalCode]
				   ,[address]
				   ,[isActive]
				   ,[isDeleted]
				   ,[dateModified]
				   ,[dateCreated])
				Select 
				    Next Value for [dbo].[Seq_tblAddress] 
				   ,3
				   ,@pBuyerID
				   ,@pCountryID
				   ,@pCityID
				   ,@pPostCode
				   ,@pAddress
				   ,1
				   ,0
				   ,GETDATE()
				   ,GETDATE() 
	END TRY
	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Profile].[uspInsertUpdateAdminUser]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 28/04/2018
-- Description:	Admin Create New and Edit Record
-- Exec [Profile].[uspInsertUpdateAdminUser]

-- =============================================
CREATE PROCEDURE [Profile].[uspInsertUpdateAdminUser]

            @pProfileID	     int=null
		   ,@pUsername		 nvarchar(250)=null
		   ,@pPassword		 nvarchar(250)=NULL
           ,@pFirstName		 nvarchar(500)
           ,@pLastName		 nvarchar(500)=NULL
           ,@pMobile		 nvarchar(100)=NULL
		   ,@pProfilePhoto    nvarchar(500)=null
           ,@pEmail			  nvarchar(500)=null
		   ,@pModifiedby	  nvarchar(500)=null
           --,@pAddress		 as Profile.UserAddress Readonly

AS
BEGIN
	BEGIN TRY
     
	DECLARE @vProfileID int,@vRoleID int
	DECLARE @vInvalidity int=1,@isValid bit=1  
	   IF EXISTS(select * from Profile.tblUser where email=@pEmail and profileID!=@pProfileID and isActive=1 and isDeleted=0)
	   BEGIN
				SET  @isValid=0
				SET  @vInvalidity=4
	   END
	   IF EXISTS(select * from Profile.tblUser where username=@pUsername and profileID!=@pProfileID and isActive=1 and isDeleted=0)
	   BEGIN
				SET  @isValid=0
				if(@vInvalidity=4)
				BEGIN
					SET  @vInvalidity=6
				END 
				ELSE
				BEGIN
					SET  @vInvalidity=5
				END 
	   END

	   IF(@isValid=1)
	   BEGIN
		IF ISNULL(@pProfileID,0) > 0
		BEGIN
	  

		   UPDATE [Profile].[tblUser]
		   SET 
			   [firstName] = @pFirstName
			  ,[lastName] = @pLastName
			  ,[mobile] = @pMobile
			  ,[password]=@pPassword
			  ,[username]=@pUsername
			  ,[email]=@pEmail
			  ,[dateModified] =GETDATE()
			WHERE profileID=@pProfileID

				IF (ISNULL(@pProfilePhoto,'')<>'')
				BEGIN
					UPDATE [Profile].[tblUser]
					   SET [profilePhoto] = @pProfilePhoto
					WHERE profileID=@pProfileID
				END

			Insert into tblLogTimeline
						(profileID,dateCreated,dateModified,isActive,isDeleted,description)
						Values (@pProfileID,GETDATE(),GETDATE(),1,0,'Admin user profile information updated.')

			Insert into tblLogTimeline
					(profileID,dateCreated,dateModified,isActive,isDeleted,description)
					 SELECT profileID,GETDATE(),GETDATE(),1,0,'admin user <strong> '+ @pFirstname +' '+ @pLastname +'</strong> profile edited by '+ @pModifiedby + '.'
					 FROM Profile.tblUserRole where roleID in (1,2)

		END
		ELSE BEGIN
		
				SET @vProfileID= Next Value for [dbo].[Seq_tblUser] 
				INSERT INTO [Profile].[tblUser]
				   ([profileID]
				   ,[username]
				   ,[password]
				   ,[firstName]
				   ,[lastName]
				   ,[mobile]
				   ,[profilePhoto]
				   ,[isActive]
				   ,[isDeleted]
				   ,[dateModified]
				   ,[dateCreated]
				   ,[email])
				 VALUES
				   (@vProfileID
				   ,@pUsername
				   ,@pPassword
				   ,@pFirstName
				   ,@pLastName
				   ,@pMobile
				   ,@pProfilePhoto
				   ,1
				   ,0
				   ,GETDATE()
				   ,GETDATE()
				   ,@pEmail)

		
				SET @vRoleID=Next Value for [dbo].[Seq_tblRole] 
				INSERT INTO [Profile].[tblUserRole]
						   ([userRoleID]
						   ,[profileID]
						   ,[roleID]
						   ,[isActive]
						   ,[isDeleted]
						   ,[dateModified]
						   ,[dateCreated])
					VALUES
				   (@vRoleID
				   ,@vProfileID
				   ,2
				   ,1
				   ,0
				   ,GETDATE()
				   ,GETDATE())	


				 IF ISNULL(@pModifiedby,'')=''
				 BEGIN
				 Insert into tblLogTimeline
						(profileID,dateCreated,dateModified,isActive,isDeleted,description)
						 SELECT profileID,GETDATE(),GETDATE(),1,0,'New admin user <strong> '+ @pFirstname +' '+ @pLastname +'</strong> profile created.'
						 FROM Profile.tblUserRole where roleID in (1,2)
				 END
				 ELSE
				 BEGIN
		 			 Insert into tblLogTimeline
						(profileID,dateCreated,dateModified,isActive,isDeleted,description)
						 SELECT profileID,GETDATE(),GETDATE(),1,0,'New admin user <strong> '+ @pFirstname +' '+ @pLastname +'</strong> profile created by '+ @pModifiedby + '.'
						 FROM Profile.tblUserRole where roleID in (1,2)
				 END
			  select 1 as result;
			  END
		END
	  select @vInvalidity as result
	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Profile].[uspInsertUpdateBuyer]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 28/04/2018
-- Description:	Buyer Admin Create New and Edit Record
-- Exec [Profile].[uspInsertUpdateBuyer]

-- =============================================
CREATE PROCEDURE [Profile].[uspInsertUpdateBuyer]

            @pProfileID	     int=null
		   ,@pUsername		 nvarchar(250)=null
		   ,@pPassword		 nvarchar(250)=NULL
           ,@pFirstName		 nvarchar(500)
           ,@pMiddleName     nvarchar(500)=NULL
           ,@pLastName		 nvarchar(500)=NULL
           ,@pMobile		 nvarchar(100)=NULL
           ,@pPhoneNumber	 nvarchar(100)=NULL
           ,@pTitleID		  int =null
           ,@pGenderID		  int =null
           ,@pMaritalStatusID int=null
           ,@pDOB			  datetime=null
		   ,@pProfilePhoto    nvarchar(500)=null
           ,@pEmail			  nvarchar(500)=null
		   ,@pModifiedby	  nvarchar(500)=null
           ,@pAddress		 as Profile.UserAddress Readonly

AS
BEGIN
	BEGIN TRY
     
	DECLARE @vProfileID int,@vAddressID int,@vRoleID int
	  
    IF ISNULL(@pProfileID,0) > 0
	BEGIN
	  

	   UPDATE [Profile].[tblUser]
	   SET 
		   [firstName] = @pFirstName
		  ,[middleName] = @pMiddleName
		  ,[lastName] = @pLastName
		  ,[mobile] = @pMobile
		  ,[phoneNumber] = @pPhoneNumber
		  ,[titleID] = @pTitleID
		  ,[genderID] = @pGenderID
		  ,[maritalStatusID] = @pMaritalStatusID
		  ,[DOB] = @pDOB
		 -- ,[profilePhoto] = @pProfilePhoto
		  ,[dateModified] =GETDATE()
	    WHERE profileID=@pProfileID

			IF (ISNULL(@pProfilePhoto,'')<>'')
			BEGIN
				UPDATE [Profile].[tblUser]
				   SET [profilePhoto] = @pProfilePhoto
				WHERE profileID=@pProfileID
			END

		
		IF EXISTS(select * FROM @pAddress )
		BEGIN
		    UPDATE [Profile].[tblUserAddress]
			SET isDeleted=1 ,isActive=0
			WHERE profileID=@pProfileID

	   			INSERT INTO [Profile].[tblUserAddress]
			   (
			    [addressID]
			   ,[addressTypeID]
			   ,[profileID]
			   ,[countryID]
			   ,[cityID]
			   ,[postalCode]
			   ,[address]
			   ,[isActive]
			   ,[isDeleted]
			   ,[dateModified]
			   ,[dateCreated])
				Select 
				    Next Value for [dbo].[Seq_tblAddress] 
				   ,addressTypeID
				   ,@pProfileID
				   ,countryID
				   ,cityID
				   ,postalCode
				   ,address
				   ,1
				   ,0
				   ,GETDATE()
				   ,GETDATE() FROM @pAddress

		END

		Insert into tblLogTimeline
					(profileID,dateCreated,dateModified,isActive,isDeleted,description)
				    Values (@pProfileID,GETDATE(),GETDATE(),1,0,'Profile information updated.')

		Insert into tblLogTimeline
				(profileID,dateCreated,dateModified,isActive,isDeleted,description)
				 SELECT profileID,GETDATE(),GETDATE(),1,0,'buyer <strong> '+ @pFirstname +' '+ @pLastname +'</strong> profile edited by '+ @pModifiedby + '.'
				 FROM Profile.tblUserRole where roleID in (1,2)

	    select 1 as result;
	END
	ELSE BEGIN
	    IF NOT EXISTS (select 1 from [Profile].[tblUser] (NoLock) where [username] = @pUsername and IsDeleted = 0)
		BEGIN
		 IF NOT EXISTS (select 1 from [Profile].[tblUser] (NoLock) where [email] = @pEmail and IsDeleted = 0)
		 BEGIN
			  
			SET @vProfileID= Next Value for [dbo].[Seq_tblUser] 
			INSERT INTO [Profile].[tblUser]
			   ([profileID]
			   ,[username]
			   ,[password]
			   ,[firstName]
			   ,[middleName]
			   ,[lastName]
			   ,[mobile]
			   ,[phoneNumber]
			   ,[titleID]
			   ,[genderID]
			   ,[maritalStatusID]
			   ,[DOB]
			   ,[profilePhoto]
			   ,[isActive]
			   ,[isDeleted]
			   ,[dateModified]
			   ,[dateCreated]
			   ,[email])
			 VALUES
			   (@vProfileID
			   ,@pUsername
			   ,@pPassword
			   ,@pFirstName
			   ,@pMiddleName
			   ,@pLastName
			   ,@pMobile
			   ,@pPhoneNumber
			   ,@pTitleID
			   ,@pGenderID
			   ,@pMaritalStatusID
			   ,@pDOB
			   ,@pProfilePhoto
			   ,1
			   ,0
			   ,GETDATE()
			   ,GETDATE()
			   ,@pEmail)


			SET @vRoleID=Next Value for [dbo].[Seq_tblRole] 
			INSERT INTO [Profile].[tblUserRole]
					   ([userRoleID]
					   ,[profileID]
					   ,[roleID]
					   ,[isActive]
					   ,[isDeleted]
					   ,[dateModified]
					   ,[dateCreated])
			    VALUES
			   (@vRoleID
			   ,@vProfileID
			   ,4
			   ,1
			   ,0
			   ,GETDATE()
			   ,GETDATE())	
		IF EXISTS(select * FROM @pAddress)
		BEGIN
		    INSERT INTO [Profile].[tblUserAddress]
				([addressID]
			   ,[addressTypeID]
			   ,[profileID]
			   ,[countryID]
			   ,[cityID]
			   ,[postalCode]
			   ,[address]
			   ,[isActive]
			   ,[isDeleted]
			   ,[dateModified]
			   ,[dateCreated])
				   (Select 
				    Next Value for [dbo].[Seq_tblAddress] 
				   ,addressTypeID
				   ,@vProfileID
				   ,countryID
				   ,cityID
				   ,postalCode
				   ,address
				   ,1
				   ,0
				   ,GETDATE()
				   ,GETDATE() FROM @pAddress)
             END
         
			 IF ISNULL(@pModifiedby,'')=''
			 BEGIN
			 Insert into tblLogTimeline
					(profileID,dateCreated,dateModified,isActive,isDeleted,description)
					 SELECT profileID,GETDATE(),GETDATE(),1,0,'New buyer <strong> '+ @pFirstname +' '+ @pLastname +'</strong> profile created.'
					 FROM Profile.tblUserRole where roleID in (1,2)
			 END
			 ELSE
			 BEGIN
		 		 Insert into tblLogTimeline
					(profileID,dateCreated,dateModified,isActive,isDeleted,description)
					 SELECT profileID,GETDATE(),GETDATE(),1,0,'New buyer <strong> '+ @pFirstname +' '+ @pLastname +'</strong> profile created by '+ @pModifiedby + '.'
					 FROM Profile.tblUserRole where roleID in (1,2)
			 END
		  select 1 as result;
		  END
		 ELSE
		 BEGIN
			 select 4 as result;
		 END
		END
		ELSE
		BEGIN
		select 5 as result;
		END
	END
	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Profile].[uspInsertUpdateSeller]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 10/04/2018
-- Description:	Seller Admin Create New and Edit Record
-- Exec [Profile].[uspInsertUpdateSeller]

-- =============================================
CREATE PROCEDURE [Profile].[uspInsertUpdateSeller]

            @pProfileID	     int=null
		   ,@pUsername		 nvarchar(250)
		   ,@pPassword		 nvarchar(250)=NULL
           ,@pFirstName		 nvarchar(500)
           ,@pMiddleName     nvarchar(500)=NULL
           ,@pLastName		 nvarchar(500)=NULL
           ,@pMobile		 nvarchar(100)=NULL
           ,@pPhoneNumber	 nvarchar(100)=NULL
           ,@pTitleID		  int =null
           ,@pGenderID		  int =null
           ,@pMaritalStatusID int=null
           ,@pDOB			  datetime=null
		   ,@pProfilePhoto    nvarchar(500)=null
           ,@pEmail			  nvarchar(500)=null
		   ,@pModifiedby	  nvarchar(500)=null

		   ,@pNICNumber		  nvarchar(250)=null
           ,@pNationality	  nvarchar(150)=null
           ,@pReligion		  nvarchar(150)=null
           ,@pIsFeatured	  bit=null
           ,@pIsTopSeller	  bit=null
		   ,@pAge			  int=null
           ,@pBannarPhoto	  nvarchar(250)=null
           ,@pWorkPhone		  nvarchar(150)=null
           ,@pDeliveryRange	  nvarchar(50)=null
           ,@pRegistrationStatusID int=null
           ,@pOfferDelivery    bit=null
           ,@pDisplayTitle	  nvarchar(500)=null
           ,@pDescription     nvarchar(max)=null
		   ,@pFolderID     nvarchar(max)=null
           ,@pRecordModified  bit=null
           ,@pModificationVerified bit=null
		   ,@pDefaultCountryID		  int =null

		   ,@pAddressTypeID	   int=null
           ,@pCountryID		   int=null
           ,@pCityID		   int=null
           ,@pPostalCode	   nvarchar(150)=null
           ,@pAddress		   nvarchar(500)=null

AS
BEGIN
	BEGIN TRY
     
	DECLARE @vProfileID int,@vSellerID int,@vAddressID int,@vRoleID int
	  
    IF ISNULL(@pProfileID,0) > 0
	BEGIN


	   UPDATE [Profile].[tblSeller]
	   SET [NICNumber] = @pNICNumber
		  ,[nationality] = @pNationality
		  ,[religion] = @pReligion
		  ,[age] = @pAge
		  ,[isFeatured] = @pIsFeatured
		  ,[isTopSeller] = @pIsTopSeller
		 -- ,[bannarPhoto] = @pBannarPhoto
		  ,[workPhone] = @pWorkPhone
		  ,[deliveryRange] = @pDeliveryRange
		  ,[registrationStatusID] = @pRegistrationStatusID
		  ,[offerDelivery] = @pOfferDelivery
		  ,[dateModified] = GETDATE()
		  ,[displayTitle] = @pdisplayTitle
		  ,[description] = @pdescription
	   WHERE [profileID] = @pProfileID

	   UPDATE [Profile].[tblUser]
	   SET 
		   [firstName] = @pFirstName
		  ,[middleName] = @pMiddleName
		  ,[lastName] = @pLastName
		  ,[mobile] = @pMobile
		  ,[phoneNumber] = @pPhoneNumber
		  ,[titleID] = @pTitleID
		  ,[genderID] = @pGenderID
		  ,[maritalStatusID] = @pMaritalStatusID
		  ,[DOB] = @pDOB
		  ,[dateModified] =GETDATE()
	    WHERE profileID=@pProfileID

			IF (ISNULL(@pProfilePhoto,'')<>'')
			BEGIN
				UPDATE [Profile].[tblUser]
				   SET [profilePhoto] = @pProfilePhoto
				WHERE profileID=@pProfileID
			END

			IF (ISNULL(@pBannarPhoto,'')<>'')
			BEGIN
					UPDATE [Profile].[tblSeller]
				   SET[bannarPhoto] = @pBannarPhoto
				   WHERE [profileID] = @pProfileID
			END
		 IF NOT EXISTS (select 1 from [Profile].[tblUserAddress] (NoLock) where [profileID]= @pProfileID and IsDeleted = 0 and postalCode= @pPostalCode 
						and @pAddressTypeID=4 and isActive=1 and countryID=@pCountryID and cityID=@pCityID and address=@pAddress )
		 BEGIN
				Update [Profile].[tblUserAddress]
				SET isDeleted=1
				,isActive=0
				WHERE  [profileID]= @pProfileID and IsDeleted = 0 and @pAddressTypeID=4 and isActive=1 

				SET @vAddressID= Next Value for [dbo].[Seq_tblAddress] 
	   			INSERT INTO [Profile].[tblUserAddress]
			   (
			    [addressID]
			   ,[addressTypeID]
			   ,[profileID]
			   ,[countryID]
			   ,[cityID]
			   ,[postalCode]
			   ,[address]
			   ,[isActive]
			   ,[isDeleted]
			   ,[dateModified]
			   ,[dateCreated])
				VALUES
					   (@vAddressID
					   ,4
					   ,@pProfileID
					   ,@pCountryID
					   ,@pCityID
					   ,@pPostalCode
					   ,@pAddress
					   ,1
					   ,0
					   ,GETDATE()
					   ,GETDATE())
		END

		Insert into tblLogTimeline
					(profileID,dateCreated,dateModified,isActive,isDeleted,description)
				    Values (@pProfileID,GETDATE(),GETDATE(),1,0,'Profile information updated.')

		Insert into tblLogTimeline
				(profileID,dateCreated,dateModified,isActive,isDeleted,description)
				 SELECT profileID,GETDATE(),GETDATE(),1,0,'seller <strong> '+ @pFirstname +' '+ @pLastname +'</strong> profile edited by '+ @pModifiedby + '.'
				 FROM Profile.tblUserRole where roleID in (1,2)

	    select 1 as result;
	END
	ELSE BEGIN
	    IF NOT EXISTS (select 1 from [Profile].[tblUser] (NoLock) where [username] = @pUsername and IsDeleted = 0)
		BEGIN
		 IF NOT EXISTS (select 1 from [Profile].[tblUser] (NoLock) where [email] = @pEmail and IsDeleted = 0)
		 BEGIN
		    SET @vProfileID= Next Value for [dbo].[Seq_tblUser] 

			INSERT INTO [Profile].[tblUser]
			   ([profileID]
			   ,[username]
			   ,[password]
			   ,[firstName]
			   ,[middleName]
			   ,[lastName]
			   ,[mobile]
			   ,[phoneNumber]
			   ,[titleID]
			   ,[genderID]
			   ,[maritalStatusID]
			   ,[DOB]
			   ,[profilePhoto]
			   ,[isActive]
			   ,[isDeleted]
			   ,[dateModified]
			   ,[dateCreated]
			   ,[email]
			   ,countryID)
			 VALUES
			   (@vProfileID
			   ,@pUsername
			   ,@pPassword
			   ,@pFirstName
			   ,@pMiddleName
			   ,@pLastName
			   ,@pMobile
			   ,@pPhoneNumber
			   ,@pTitleID
			   ,@pGenderID
			   ,@pMaritalStatusID
			   ,@pDOB
			   ,@pProfilePhoto
			   ,1
			   ,0
			   ,GETDATE()
			   ,GETDATE()
			   ,@pEmail
			   ,@pDefaultCountryID)

	        SET @vRoleID=Next Value for [dbo].[Seq_tblRole] 
			INSERT INTO [Profile].[tblUserRole]
					   ([userRoleID]
					   ,[profileID]
					   ,[roleID]
					   ,[isActive]
					   ,[isDeleted]
					   ,[dateModified]
					   ,[dateCreated])
			    VALUES
			   (@vRoleID
			   ,@vProfileID
			   ,3
			   ,1
			   ,0
			   ,GETDATE()
			   ,GETDATE())	


			SET @vSellerID=Next Value for [dbo].[Seq_tblSeller] 
			INSERT INTO [Profile].[tblSeller]
           ([sellerID]
		   ,[profileID]
           ,[NICNumber]
           ,[nationality]
           ,[religion]
           ,[age]
           ,[isFeatured]
           ,[isTopSeller]
           ,[bannarPhoto]
           ,[workPhone]
           ,[deliveryRange]
           ,[registrationStatusID]
           ,[offerDelivery]
           ,[isActive]
           ,[isDeleted]
           ,[dateModified]
           ,[dateCreated]
           ,[displayTitle]
           ,[description]
           ,[recordModified]
           ,[modificationVerified]
		   ,FolderID)
     VALUES
           (@vSellerID
		   ,@vProfileID
           ,@pNICNumber
           ,@pNationality
           ,@pReligion
           ,@pAge
           ,@pIsFeatured
           ,@pIsTopSeller
           ,@pBannarPhoto
           ,@pWorkPhone
           ,@pDeliveryRange
           ,@pRegistrationStatusID
           ,@pOfferDelivery
           ,1
           ,0
           ,GETDATE()
           ,GETDATE()
           ,@pDisplayTitle
           ,@pDescription
           ,@pRecordModified
           ,@pModificationVerified
		   ,@pFolderID)
		   
		   SET @vAddressID= Next Value for [dbo].[Seq_tblAddress] 
		    INSERT INTO [Profile].[tblUserAddress]
           ([addressID]
		   ,[addressTypeID]
           ,[profileID]
           ,[countryID]
           ,[cityID]
           ,[postalCode]
           ,[address]
           ,[isActive]
           ,[isDeleted]
           ,[dateModified]
           ,[dateCreated])
			VALUES
				   (@vAddressID
				   ,4
				   ,@vProfileID
				   ,@pCountryID
				   ,@pCityID
				   ,@pPostalCode
				   ,@pAddress
				   ,1
				   ,0
				   ,GETDATE()
				   ,GETDATE())

         
			 IF ISNULL(@pModifiedby,'')=''
			 BEGIN
			 Insert into tblLogTimeline
					(profileID,dateCreated,dateModified,isActive,isDeleted,description)
					 SELECT profileID,GETDATE(),GETDATE(),1,0,'New seller <strong> '+ @pFirstname +' '+ @pLastname +'</strong> profile created.'
					 FROM Profile.tblUserRole where roleID in (1,2)
			 END
			 ELSE
			 BEGIN
		 		 Insert into tblLogTimeline
					(profileID,dateCreated,dateModified,isActive,isDeleted,description)
					 SELECT profileID,GETDATE(),GETDATE(),1,0,'New seller <strong> '+ @pFirstname +' '+ @pLastname +'</strong> profile created by '+ @pModifiedby + '.'
					 FROM Profile.tblUserRole where roleID in (1,2)
			 END
		  select 1 as result;
		  END
		 ELSE
		 BEGIN
			 select 4 as result;
		 END
		END
		ELSE
		BEGIN
		select 5 as result;
		END
	END
	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Profile].[uspInsertUpdateSellerAccountInfo]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 10/04/2018
-- Description:	Seller Admin Create New and Edit Record
-- Exec [Profile].[uspInsertUpdateSeller]

-- =============================================
CREATE PROCEDURE [Profile].[uspInsertUpdateSellerAccountInfo]

            @pProfileID	     int=null
		   ,@pAccountTitle		 nvarchar(250)
		   ,@pAccountNumber		 nvarchar(250)=NULL
           ,@pBankName	 nvarchar(500)
           

AS
BEGIN
    DECLARE @vProfileID int,@vUsername nvarchar(500),@vEmail nvarchar(500)
	BEGIN TRY
    IF ISNULL(@pProfileID,0) > 0
	BEGIN
	SELECT @vUsername=username ,@vEmail=email from Profile.tblUser where profileID=@pProfileID


	   UPDATE [Profile].[tblSeller]
	   SET [accountNumber] = @pAccountNumber
		  ,[accountTitle] = @pAccountTitle
		  ,[bankName] = @pBankName
		  ,registrationStatusID=1
	   WHERE [profileID] = @pProfileID

	 
		Insert into tblLogTimeline
					(profileID,dateCreated,dateModified,isActive,isDeleted,description)
				    Values (@pProfileID,GETDATE(),GETDATE(),1,0,'Seller added his/her account information.')

		Insert into tblLogTimeline
				(profileID,dateCreated,dateModified,isActive,isDeleted,description)
				 SELECT profileID,GETDATE(),GETDATE(),1,0,'Seller <strong> '+ @vEmail +' ('+ @vUsername +')</strong> added his/her account information.'
				 FROM Profile.tblUserRole where roleID in (1,2)

	END

	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Profile].[uspInsertUpdateSellerPersonalInfo]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 10/04/2018
-- Description:	Seller Admin Create New and Edit Record
-- Exec  [Profile].[uspInsertUpdateSellerPersonalInfo]

-- =============================================
CREATE PROCEDURE [Profile].[uspInsertUpdateSellerPersonalInfo]

            @pProfileID	     int=null
           ,@pFirstName		 nvarchar(500)
           ,@pLastName		 nvarchar(500)=NULL
           ,@pMobile		 nvarchar(100)=NULL
           ,@pPhoneNumber	 nvarchar(100)=NULL
           ,@pTitleID		  int =null
           ,@pGenderID		  int =null
           ,@pMaritalStatusID int=null
           ,@pDOB			  datetime=null
		   ,@pProfilePhoto    nvarchar(500)=null
           ,@pDescription     nvarchar(max)=null
		   ,@pDefaultCountryID		   int=null
		   ,@pAddressTypeID	   int=null
           ,@pCountryID		   int=null
           ,@pCityID		   int=null
           ,@pPostalCode	   nvarchar(150)=null
           ,@pAddress		   nvarchar(500)=null

AS
BEGIN
	BEGIN TRY
     
	DECLARE @vProfileID int,@vSellerID int,@vAddressID int,@vRoleID int
	  
    IF ISNULL(@pProfileID,0) > 0
	BEGIN


	   UPDATE [Profile].[tblSeller]
	   SET [dateModified] = GETDATE()
		  ,[description] = @pdescription
	   WHERE [profileID] = @pProfileID

	   UPDATE [Profile].[tblUser]
	   SET 
		   [firstName] = @pFirstName
		  ,[lastName] = @pLastName
		  ,[mobile] = @pMobile
		  ,[phoneNumber] = @pPhoneNumber
		  ,[titleID] = @pTitleID
		  ,[genderID] = @pGenderID
		  ,[maritalStatusID] = @pMaritalStatusID
		  ,[DOB] = @pDOB
		  ,countryID=@pCountryID
		  ,[dateModified] =GETDATE()
	    WHERE profileID=@pProfileID

			IF (ISNULL(@pProfilePhoto,'')<>'')
			BEGIN
				UPDATE [Profile].[tblUser]
				   SET [profilePhoto] = @pProfilePhoto
				WHERE profileID=@pProfileID
			END

		
		 IF NOT EXISTS (select 1 from [Profile].[tblUserAddress] (NoLock) where [profileID]= @pProfileID and IsDeleted = 0 and postalCode= @pPostalCode 
						and @pAddressTypeID=4 and isActive=1 and countryID=@pCountryID and cityID=@pCityID and address=@pAddress )
		 BEGIN
				Update [Profile].[tblUserAddress]
				SET isDeleted=1
				,isActive=0
				WHERE  [profileID]= @pProfileID and IsDeleted = 0 and @pAddressTypeID=4 and isActive=1 

				SET @vAddressID= Next Value for [dbo].[Seq_tblAddress] 
	   			INSERT INTO [Profile].[tblUserAddress]
			   (
			    [addressID]
			   ,[addressTypeID]
			   ,[profileID]
			   ,[countryID]
			   ,[cityID]
			   ,[postalCode]
			   ,[address]
			   ,[isActive]
			   ,[isDeleted]
			   ,[dateModified]
			   ,[dateCreated])
				VALUES
					   (@vAddressID
					   ,4
					   ,@pProfileID
					   ,@pCountryID
					   ,@pCityID
					   ,@pPostalCode
					   ,@pAddress
					   ,1
					   ,0
					   ,GETDATE()
					   ,GETDATE())
		END

		Insert into tblLogTimeline
					(profileID,dateCreated,dateModified,isActive,isDeleted,description)
				    Values (@pProfileID,GETDATE(),GETDATE(),1,0,'Seller added his/her personal information.')

		Insert into tblLogTimeline
				(profileID,dateCreated,dateModified,isActive,isDeleted,description)
				 SELECT profileID,GETDATE(),GETDATE(),1,0,'seller <strong> '+ @pFirstname +' '+ @pLastname +'</strong> added personal information.'
				 FROM Profile.tblUserRole where roleID in (1,2)

	    select 1 as result;
	END

	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Profile].[uspInsertUpdateSellerWorkInfo]    Script Date: 12/29/2019 3:46:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 10/04/2018
-- Description:	Seller Admin Create New and Edit Record
-- Exec [Profile].[uspInsertUpdateSellerWorkInfo]

-- =============================================
CREATE PROCEDURE [Profile].[uspInsertUpdateSellerWorkInfo]

            @pProfileID	     int=null
		   ,@pNICNumber		  nvarchar(250)=null
           ,@pNationality	  nvarchar(150)=null
           ,@pBannarPhoto	  nvarchar(250)=null

           ,@pDeliveryRange	  nvarchar(50)=null
           ,@pOfferDelivery    bit=null
           ,@pDisplayTitle	  nvarchar(500)=null
   


AS
BEGIN
	BEGIN TRY
     
	DECLARE @vProfileID int,@vUsername nvarchar(500),@vEmail nvarchar(500)
	  
    IF ISNULL(@pProfileID,0) > 0
	BEGIN
	  SELECT @vUsername=username ,@vEmail=email from Profile.tblUser where profileID=@pProfileID

	   UPDATE [Profile].[tblSeller]
	   SET [NICNumber] = @pNICNumber
		  ,[nationality] = @pNationality
		  ,[deliveryRange] = @pDeliveryRange
		  ,[offerDelivery] = @pOfferDelivery
		  ,[dateModified] = GETDATE()
		  ,[displayTitle] = @pdisplayTitle
	   WHERE [profileID] = @pProfileID

		IF (ISNULL(@pBannarPhoto,'')<>'')
			BEGIN
					UPDATE [Profile].[tblSeller]
				   SET[bannarPhoto] = @pBannarPhoto
				   WHERE [profileID] = @pProfileID
			END
		

		Insert into tblLogTimeline
					(profileID,dateCreated,dateModified,isActive,isDeleted,description)
				    Values (@pProfileID,GETDATE(),GETDATE(),1,0,'Seller added his/her work information.')

		Insert into tblLogTimeline
				(profileID,dateCreated,dateModified,isActive,isDeleted,description)
				 SELECT profileID,GETDATE(),GETDATE(),1,0,'seller <strong> '+ @vEmail +' ('+ @vUsername +')</strong> added his/her work information.'
				 FROM Profile.tblUserRole where roleID in (1,2)
	END

	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Profile].[uspJoinTashty]    Script Date: 12/29/2019 3:46:39 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 28/04/2018
-- Description:	Buyer Admin Create New and Edit Record
-- Exec [Profile].[uspJoinTashty]
-- =============================================
CREATE PROCEDURE [Profile].[uspJoinTashty]

            @pIsSeller		 bit
		   ,@pUsername		 nvarchar(250)=null
		   ,@pPassword		 nvarchar(250)=NULL
           ,@pEmail			 nvarchar(500)=null
		   ,@pFolderID		 nvarchar(500)=null
		   ,@pIsFacebook     bit=0
		   ,@pIsGoogle      bit=0
		   ,@pAppID         nvarchar(500)=null

AS
BEGIN
	DECLARE @vProfileID int, @vSellerID int,@vRoleID int

	BEGIN TRY
		 IF NOT EXISTS (select 1 from [Profile].[tblUser] (NoLock) where [email] = @pEmail and IsDeleted = 0)
		 BEGIN
			
			SET @vProfileID=Next Value for [dbo].[Seq_tblUser] 
			INSERT INTO [Profile].[tblUser]
			   ([profileID]
			   ,[username]
			   ,[password]
			   ,[isActive]
			   ,[isDeleted]
			   ,[dateModified]
			   ,[dateCreated]
			   ,[email]
			   ,[isFacebook]
			   ,[isGoogle]
			   ,[token])
			 VALUES
			   (@vProfileID
			   ,@pUsername
			   ,@pPassword
			   ,1
			   ,0
			   ,GETDATE()
			   ,GETDATE()
			   ,@pEmail
			   ,@pIsFacebook
			   ,@pIsGoogle
			   ,@pAppID)

         
		 IF @pIsSeller=1
			 BEGIN
			    --SELECT @pIsSeller
			    SET @vSellerID=Next Value for [dbo].[Seq_tblSeller] 
			 	INSERT INTO [Profile].[tblSeller]
					   ([sellerID]
					   ,[profileID]
					   ,[isActive]
					   ,[isDeleted]
					   ,[dateModified]
					   ,[dateCreated]
					   ,FolderID
					   ,registrationStatusID)
				 VALUES
					   (@vSellerID
					   ,@vProfileID
					   ,1
					   ,0
					   ,GETDATE()
					   ,GETDATE()
					   ,@pFolderID
					   ,6)

			SET @vRoleID=Next Value for [dbo].[Seq_tblRole] 
			INSERT INTO [Profile].[tblUserRole]
					   ([userRoleID]
					   ,[profileID]
					   ,[roleID]
					   ,[isActive]
					   ,[isDeleted]
					   ,[dateModified]
					   ,[dateCreated])
			    VALUES
			   (@vRoleID
			   ,@vProfileID
			   ,3
			   ,1
			   ,0
			   ,GETDATE()
			   ,GETDATE())	

			 Insert into tblLogTimeline
					(profileID,dateCreated,dateModified,isActive,isDeleted,description)
					 SELECT profileID,GETDATE(),GETDATE(),1,0,'New seller <strong> '+ @pEmail+' ('+ @pUsername +')</strong> profile created.'
					 FROM Profile.tblUserRole where roleID in (1,2)
			 END
		 ELSE
		  BEGIN
		   SET @vRoleID=Next Value for [dbo].[Seq_tblRole] 
			INSERT INTO [Profile].[tblUserRole]
					   ([userRoleID]
					   ,[profileID]
					   ,[roleID]
					   ,[isActive]
					   ,[isDeleted]
					   ,[dateModified]
					   ,[dateCreated])
			    VALUES
			   (@vRoleID
			   ,@vProfileID
			   ,4			   ,1
			   ,0
			   ,GETDATE()
			   ,GETDATE())	
			 Insert into tblLogTimeline
					(profileID,dateCreated,dateModified,isActive,isDeleted,description)
					 SELECT profileID,GETDATE(),GETDATE(),1,0,'New buyer <strong> '+ @pEmail+' ('+ @pUsername +')</strong> profile created.'
					 FROM Profile.tblUserRole where roleID in (1,2)
			 END

			
		END
		select @vProfileID 'profileID'
	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Profile].[uspMarkBuyerActive]    Script Date: 12/29/2019 3:46:39 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 20/03/2018
-- Description:	Product Category
-- Exec [Profile].[uspMarkBuyerActive] 1,1,0

-- =============================================
CREATE PROCEDURE [Profile].[uspMarkBuyerActive] 
    @pProfileID	int	 
   ,@pAdminProfileID int
   ,@pIsActive		bit
AS
BEGIN
    DECLARE	@vActive nvarchar(max), 
			@vName nvarchar(max),
			@vAdminName nvarchar(max),
			@vIsSeller bit

	set @vActive='active'	
	BEGIN TRY
    if(@pIsActive=0)
	begin
		set @vActive='inactive'		
	end

	 IF EXISTS (SELECT * FROM Profile.tblUserRole WHERE roleID=3 and profileID=@pProfileID and isDeleted=0)
	 BEGIN
	   SET @vIsSeller=1
	 END 

	   
    IF ISNULL(@pProfileID,0) > 0
	BEGIN
	    SELECT @vName=username from  [Profile].[tblUser] where profileID=@pProfileID
		SELECT @vAdminName=firstName +' '+lastName from  [Profile].[tblUser] where profileID=@pAdminProfileID

		IF(@vIsSeller<>1)
		BEGIN
					UPDATE [Profile].[tblUser]
					SET
					   isActive=@pIsActive
					  ,[dateModified] = GETDATE()
					  ,[modifiedBy] = @pAdminProfileID
					WHERE profileID=@pProfileID
		END
		ELSE
		BEGIN
					UPDATE [Profile].[tblUserRole]
					SET
					   isActive=@pIsActive
					  ,[dateModified] = GETDATE()
					WHERE profileID=@pProfileID and roleID=4
		END


		
		 Insert into tblLogTimeline
				(profileID,dateCreated,dateModified,isActive,isDeleted,description)
				 Values (@pProfileID,GETDATE(),GETDATE(),1,0,@vAdminName+' marked buyer <b>'+ @vName +'</b> profile ' +@vActive +'.')
	END
	
	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Profile].[uspMarkFeatureRequest]    Script Date: 12/29/2019 3:46:39 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 20/03/2018
-- Description:	Product Category
-- Exec [Profile].[uspMarkFeatureRequest]  1,1,0

-- =============================================
Create PROCEDURE [Profile].[uspMarkFeatureRequest] 
    @pRequestID	int	 
   ,@pAdminProfileID int
   ,@pStatusID		bit
AS
BEGIN
    DECLARE	@vActive nvarchar(max), 
			@vName nvarchar(max),
			@vAdminName nvarchar(max),
			@vIsBuyer bit,
			@vProfileID int

	set @vActive='pending'	
	BEGIN TRY
    if(@pStatusID=0)
	begin
		select @vActive=title  From Lookup.tblRequestStatus where requestStatusID=@pStatusID		
	end
	 select @vProfileID=profileID  From Product.featureRequest where featureRequestID=@pRequestID	
	  
    IF ISNULL(@vProfileID,0) > 0
	BEGIN
	    SELECT @vName=username from  [Profile].[tblUser] where profileID=@vProfileID
		SELECT @vAdminName=firstName +' '+lastName from  [Profile].[tblUser] where profileID=@pAdminProfileID

		
			UPDATE Product.featureRequest
			SET
			   requestStatusID=@pStatusID
			  ,[dateModified] = GETDATE()
			 -- ,[modifiedBy] = @pAdminProfileID
			WHERE featureRequestID=@pRequestID

		 Insert into tblLogTimeline
				(profileID,dateCreated,dateModified,isActive,isDeleted,description)
				 Values (@vProfileID,GETDATE(),GETDATE(),1,0,@vAdminName+' '+@vName +' seller featured request.')

		Insert into tblLogTimeline
				(profileID,dateCreated,dateModified,isActive,isDeleted,description)
				 Values (@pAdminProfileID,GETDATE(),GETDATE(),1,0,@vAdminName+' '+@vName +' seller featured request.')
	END
	
	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Profile].[uspMarkSellerActive]    Script Date: 12/29/2019 3:46:39 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 20/03/2018
-- Description:	Product Category
-- Exec [Profile].[uspMarkSellerActive] 1,1,0

-- =============================================
CREATE PROCEDURE [Profile].[uspMarkSellerActive] 
    @pProfileID	int	 
   ,@pAdminProfileID int
   ,@pIsActive		bit
AS
BEGIN
    DECLARE	@vActive nvarchar(max), 
			@vName nvarchar(max),
			@vAdminName nvarchar(max),
			@vIsBuyer bit

	set @vActive='active'	
	BEGIN TRY
    if(@pIsActive=0)
	begin
		set @vActive='inactive'		
	end
	   
  --   IF EXISTS (SELECT * FROM Profile.tblUserRole WHERE roleID=4 and profileID=@pProfileID and isDeleted=0)
	 --BEGIN
	   SET @vIsBuyer=1
	 --END 

    IF ISNULL(@pProfileID,0) > 0
	BEGIN
	    SELECT @vName=username from  [Profile].[tblUser] where profileID=@pProfileID
		SELECT @vAdminName=firstName +' '+lastName from  [Profile].[tblUser] where profileID=@pAdminProfileID

		IF(@vIsBuyer<>1)
		BEGIN
			UPDATE [Profile].[tblUser]
			SET
			   isActive=@pIsActive
			  ,[dateModified] = GETDATE()
			  ,[modifiedBy] = @pAdminProfileID
			WHERE profileID=@pProfileID
		END
		ELSE
		BEGIN
			UPDATE [Profile].[tblUserRole]
			SET
			   isActive=@pIsActive
			  ,[dateModified] = GETDATE()
			WHERE profileID=@pProfileID and roleID=3
		END

		UPDATE [Profile].[tblSeller]
	    SET
		   isActive=@pIsActive
		  ,[dateModified] = GETDATE()
		  ,[modifiedBy] = @pAdminProfileID
	    WHERE profileID=@pProfileID


		
		 Insert into tblLogTimeline
				(profileID,dateCreated,dateModified,isActive,isDeleted,description)
				 Values (@pProfileID,GETDATE(),GETDATE(),1,0,@vAdminName+' marked seller <b>'+ @vName +'</b> profile ' +@vActive +'.')
	END
	
	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Profile].[uspMarkSellerFeatureRequest]    Script Date: 12/29/2019 3:46:39 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 20/03/2018
-- Description:	Product Category
-- Exec [Profile].[uspMarkFeatureRequest]  1,1,0

-- =============================================
CREATE  PROCEDURE [Profile].[uspMarkSellerFeatureRequest] 
     @pSellerID as int
	,@pStartDate as datetime
	,@pEndDate as datetime
	,@pAmount as int
	,@pNote as nvarchar(500)=null
AS
BEGIN
  BEGIN TRY


     INSERT INTO [Product].[featureRequest]
           ([featureRequestID]
           ,[profileID]
           ,[dateFrom]
           ,[dateTo]
 
           ,[requestStatusID]
           ,[note]
           ,[isActive]
           ,[isDeleted]
           ,[dateCreated]
           ,[dateModified]
           ,[payed]
           ,[amountPayed])
     VALUES
           (Next Value for [dbo].[Seq_tblFeatureRequest] 
           ,@pSellerID
           ,@pStartDate
           ,@pEndDate
           ,1
           ,@pNote
           ,1
           ,0
           ,getdate()
           ,getdate()
           ,0
           ,@pAmount)

	
	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Profile].[uspSaveBuyerProfileInfo]    Script Date: 12/29/2019 3:46:39 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 28/04/2018
-- Description:	Buyer Admin Create New and Edit Record
-- Exec [Profile].[uspSaveBuyerProfileInfo]

-- =============================================
CREATE PROCEDURE [Profile].[uspSaveBuyerProfileInfo]

            @pProfileID	     int=null
           ,@pFirstName		 nvarchar(500)
           ,@pLastName		 nvarchar(500)=NULL
           ,@pMobile		 nvarchar(100)=NULL
           ,@pPhoneNumber	 nvarchar(100)=NULL
           ,@pTitleID		  int =null
           ,@pGenderID		  int =null
		   ,@pCountryID		  int =null
           ,@pMaritalStatusID int=null
           ,@pDOB			  datetime=null
		   ,@pProfilePhoto    nvarchar(500)=null
		   ,@pModifiedby	  nvarchar(500)=null
           ,@pAddress		 as Profile.UserAddress Readonly

AS
BEGIN
	BEGIN TRY
     
	DECLARE @vProfileID int,@vAddressID int,@vRoleID int
	  
    IF ISNULL(@pProfileID,0) > 0
	BEGIN
	  

	   UPDATE [Profile].[tblUser]
	   SET 
		   [firstName] = @pFirstName
		   ,countryID=@pCountryID
		  ,[lastName] = @pLastName
		  ,[mobile] = @pMobile
		  ,[phoneNumber] = @pPhoneNumber
		  ,[titleID] = @pTitleID
		  ,[genderID] = @pGenderID
		  ,[maritalStatusID] = @pMaritalStatusID
		  ,[DOB] = @pDOB
		  ,[dateModified] =GETDATE()
	    WHERE profileID=@pProfileID

			IF (ISNULL(@pProfilePhoto,'')<>'')
			BEGIN
				UPDATE [Profile].[tblUser]
				   SET [profilePhoto] = @pProfilePhoto
				WHERE profileID=@pProfileID
			END

		
		IF EXISTS(select * FROM @pAddress )
		BEGIN
		    UPDATE [Profile].[tblUserAddress]
			SET isDeleted=1 ,isActive=0
			WHERE profileID=@pProfileID

	   			INSERT INTO [Profile].[tblUserAddress]
			   (
			    [addressID]
			   ,[addressTypeID]
			   ,[profileID]
			   ,[countryID]
			   ,[cityID]
			   ,[postalCode]
			   ,[address]
			   ,[isActive]
			   ,[isDeleted]
			   ,[dateModified]
			   ,[dateCreated])
				Select 
				    Next Value for [dbo].[Seq_tblAddress] 
				   ,addressTypeID
				   ,@pProfileID
				   ,countryID
				   ,cityID
				   ,postalCode
				   ,address
				   ,1
				   ,0
				   ,GETDATE()
				   ,GETDATE() FROM @pAddress

		END

		Insert into tblLogTimeline
					(profileID,dateCreated,dateModified,isActive,isDeleted,description)
				    Values (@pProfileID,GETDATE(),GETDATE(),1,0,'Buyer added his/her profile information.')

		Insert into tblLogTimeline
				(profileID,dateCreated,dateModified,isActive,isDeleted,description)
				 SELECT profileID,GETDATE(),GETDATE(),1,0,'buyer <strong> '+ @pFirstname +' '+ @pLastname +'</strong> added his/her profile information.'
				 FROM Profile.tblUserRole where roleID in (1,2)

	END
	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Profile].[uspSearchBuyerDasboard]    Script Date: 12/29/2019 3:46:39 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 04/06/2018
-- Description:	Get All Seller List
-- Exec [Profile].[uspSearchBuyerDasboard] 3,'Donald','Plot','Mighty Zinger',1
-- Exec [Profile].[uspSearchBuyerDasboard] 3,'','','',1

-- =============================================
CREATE PROCEDURE [Profile].[uspSearchBuyerDasboard]
		 @pCatgoryID int =null	 
		,@pSeller nvarchar(MAX) =null
		,@pAddress nvarchar(MAX) =null
		,@pMealTitle nvarchar(MAX) =null
		,@CountryID int
AS
BEGIN
	BEGIN TRY
	DECLARE		@Query			nvarchar(max),
				@vCriteria		nVarchar(Max),
				@vOrderBy		nvarchar(max)
	

	SET @vOrderBy =' ORDER BY sellerID DESC'
	Set @vCriteria	 = ' WHERE pu.isDeleted=0 --and ps.registrationStatusID = 4 '

	IF isnull(@pAddress,'')<>'' SET @vCriteria = @vCriteria + Char(13) + 'and (select address +'', ''+ city +'', '' + country from Profile.tblUserAddress as pua Inner join Lookup.tblCity as lc on lc.cityID=pua.cityID'+
      +' Inner join Lookup.tblCountry as lco on lco.countryID=pua.countryID where profileID=pu.profileID and addressTypeID=4 and pua.isActive=1 and pua.isDeleted=0 and pua.countryID='+ cast(@CountryID as nvarchar(20)) +')like ''%' + @pAddress + '%'''
	
	IF isnull(@pSeller,'')<>'' SET @vCriteria = @vCriteria + Char(13) + 'and (displayTitle like ''%' + @pSeller + '%'')'


	IF  isnull(@pCatgoryID,0 )<> 0 and isnull(@pMealTitle,'' )<> ''
	BEGIN
	    SET @vCriteria = @vCriteria + Char(13) + 'and (pu.profileID in (SELECT DISTINCT profileID FROM product.tblMeal WHERE categoryID= '+Cast( @pCatgoryID as nvarchar(20))+ 'and '+
																		+'title like''%' + @pMealTitle + '%''))'
	END
	IF (isnull(@pCatgoryID,0 )<> 0 and isnull(@pMealTitle,'' )='')
	BEGIN
	    SET @vCriteria = @vCriteria + Char(13) + 'and (pu.profileID in (SELECT DISTINCT profileID FROM product.tblMeal WHERE categoryID= ' +Cast( @pCatgoryID as nvarchar(20)) +'))'
	END
	IF (isnull(@pCatgoryID,0 )= 0 and isnull(@pMealTitle,'' )<>'')
	BEGIN
	       SET @vCriteria = @vCriteria + Char(13) + 'and (pu.profileID in (SELECT DISTINCT profileID FROM product.tblMeal WHERE title like''%' + @pMealTitle + '%''))'
	END

		
	SET @Query = 'SELECT [sellerID]
		  ,pu.[profileID]
		  ,ISNULL([deliveryRange],'''') as deliveryRange
		  ,ps.[registrationStatusID]
		  ,ISNULL([offerDelivery],0) as offerDelivery
		  ,ISNULL([displayTitle],'''') as displayTitle
		  ,ISNULL(ps.description,'''') as description
		  ,ISNULL([ratedCount],0) as ratedCount
		  ,ISNULL([avgRating],0) as avgRating
		  ,ISNULL([modificationVerified],0) modificationVerified
		  ,ISNULL(ps.bannarPhoto,'''')  as bannarPhoto
		  ,ISNULL( pu.profilePhoto,'''')  as profilePhoto
		 -- ,ps.deliveryRange as deliveryRange
		--  ,ps.offerDelivery as offerDelivery
		  ,cty.currency as currencyID
		  ,cur.sign as currency
		  ,dis.unit
		  ,pua.address as address
		 -- ,(select address +'', ''+ city +'', '' + country
			-- from Profile.tblUserAddress as pua
			--Inner join Lookup.tblCity as lc on lc.cityID=pua.cityID
			--Inner join Lookup.tblCountry as lco on lco.countryID=pua.countryID
			--where profileID=pu.profileID 
			--and addressTypeID=4 
			--and pua.isActive=1 and 
			--pua.isDeleted=0) as [permanentAddress]
	FROM  [Profile].[tblSeller]  (NOLOCK) as ps
	inner join [Profile].[tblUser] (NOLOCK) as pu ON pu.profileID=ps.profileID
	 left outer  join Profile.tblUserAddress as pua ON pua.profileID=ps.profileID and pua.addressTypeID=4 and pua.isActive=1 and pua.isDeleted=0
	 left outer  join Lookup.tblCountry as cty ON cty.countryID=pua.countryID
	 inner join Lookup.tblCurrency as cur ON cur.currencyID=cty.currency
	 inner join Lookup.tblDistanceUnit as dis ON dis.unitID=cty.distanceUnitID'++Char(13)+@vCriteria+@vOrderBy
	
	Print substring(@Query , 0 , 4000)
	Exec sp_executesql @Query

	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Profile].[uspSellerSearchByAddress]    Script Date: 12/29/2019 3:46:39 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 04/06/2018
-- Description:	Get All Seller List
-- Exec [Profile].[uspSellerSearchByAddress] 'Plot No. 12, Survey 159/112 ,Commercial !,Market ,Islamabad', 2
-- Exec [Profile].[uspSellerSearchByAddress] 'Islamabad', 2

-- =============================================
CREATE PROCEDURE [Profile].[uspSellerSearchByAddress]
		@pAddress nvarchar(MAX)	 
	   ,@pCountryID int
AS
BEGIN
	BEGIN TRY
	

	 SELECT    sellerID
		      ,ps.profileID as profileID
			  ,email
			  ,username
			  ,firstName
			  ,lastName
			  ,isnull(displayTitle,'Service Provider') as 'displayTitle'
			  ,ps.FolderID as FolderID
			  ,isnull(ps.logo,'') as logo
			  ,isnull(ps.avgRating,0) as avgRating
			  ,isnull(ps.ratedCount,0) as ratedCount
			  ,isnull(ps.bannarPhoto,'') as bannarPhoto
			  ,isnull(pu.profilePhoto,'') as profilePhoto
			  ,isnull(ps.description,'') as description
			  ,isnull(pua.address,'') as address
			  ,isnull(ps.deliveryRange,0) as deliveryRange
			  ,isnull(ps.offerDelivery,0) as offerDelivery
			  ,cty.currency as currencyID
			  ,cur.sign as currency
			  ,dis.unit
			  ,cit.city
			  ,pua.postalCode
	 FROM Profile.tblSeller as ps 
	 left outer  join Profile.tblUser as pu ON pu.profileID=ps.profileID
	 left outer  join Profile.tblUserAddress as pua ON pua.profileID=ps.profileID and pua.addressTypeID=4 and pua.isActive=1 and pua.isDeleted=0
	 left outer  join Lookup.tblCountry as cty ON cty.countryID=pua.countryID
	 left outer  join Lookup.tblCity as cit ON cit.countryID=pua.countryID
	 inner join Lookup.tblCurrency as cur ON cur.currencyID=cty.currency
	 inner join Lookup.tblDistanceUnit as dis ON dis.unitID=cty.distanceUnitID
	 WHERE pu.isDeleted=0 and pua.countryID=@pCountryID and pu.isActive=1 
	 and ( dbo.udf_Cleanchars(TRIM(pua.address) +' '+ cit.city ) Like '%'+dbo.udf_Cleanchars(TRIM(@pAddress))+'%'  OR postalCode=dbo.udf_Cleanchars(TRIM(@pAddress)))

	

	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Profile].[uspSellerSearchByCategory]    Script Date: 12/29/2019 3:46:39 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 04/06/2018
-- Description:	Get All Seller List
-- Exec [Profile].[uspSellerSearchByCategory] 3

-- =============================================
CREATE PROCEDURE [Profile].[uspSellerSearchByCategory]
		 @pCatgoryID int	 
		 ,@pCountryID int=2
AS
BEGIN
	BEGIN TRY
	SET @pCountryID=2
	 SELECT 
	   distinct ml.profileID as profileID
	   ,cat.categoryID
	 INTO #tempProMeal
	 FROM Product.tblMeal as ml
	 INNER JOIN Product.tblCategory as cat ON cat.categoryID=ml.categoryID
	 WHERE ml.isDeleted=0 and ml.isActive=1 and ml.categoryID=@pCatgoryID

	 --select * from #tempProMeal

	 SELECT    sellerID
		      ,ps.profileID as profileID
			  ,email
			  ,username
			  ,firstName
			  ,lastName
			   ,isnull(displayTitle,'Service Provider') as 'displayTitle'
			  ,ps.FolderID as FolderID
			  ,isnull(ps.logo,'') as logo
			  ,isnull(ps.avgRating,0) as avgRating
			  ,isnull(ps.ratedCount,0) as ratedCount
			  ,isnull(ps.bannarPhoto,'') as bannarPhoto
			  ,isnull(pu.profilePhoto,'') as profilePhoto
			  ,isnull(ps.description,'') as description
			  ,isnull(pua.address,'') as address
			  ,isnull(ps.deliveryRange,0) as deliveryRange
			  ,isnull(ps.offerDelivery,0) as offerDelivery
			  ,cty.currency as currencyID
			  ,cur.sign as currency
			  ,dis.unit
	 FROM Profile.tblSeller as ps 
	 left outer  join Profile.tblUser as pu ON pu.profileID=ps.profileID
	 left outer  join Profile.tblUserAddress as pua ON pua.profileID=ps.profileID and pua.addressTypeID=4 and pua.isActive=1 and pua.isDeleted=0
	 left outer  join Lookup.tblCountry as cty ON cty.countryID=pua.countryID
	 inner join Lookup.tblCurrency as cur ON cur.currencyID=cty.currency
	 inner join Lookup.tblDistanceUnit as dis ON dis.unitID=cty.distanceUnitID
	 WHERE pu.isDeleted=0 and pua.countryID=@pCountryID and pu.isActive=1 and pu.profileID in (SELECT profileID FROM #tempProMeal)

	
	DROP TABLE #tempProMeal

	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Profile].[uspSellerUpdateLogo]    Script Date: 12/29/2019 3:46:39 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 20/10/2015
-- Description:	User Login
-- Exec [Profile].[uspSellerUpdateLogo] 1,'CgumbG+yQieUWyDi3nSrhUj0BUVRr4Uf+SZgl7VoVmI='

-- =============================================
CREATE PROCEDURE [Profile].[uspSellerUpdateLogo]
				@pProfileID int,
				@pLogo nvarchar(max)

				 
AS
BEGIN
	BEGIN TRY
	 DECLARE @vCurrentDate date =Getdate() 

	 IF EXISTS (select 1 from Profile.tblUser (NoLock) where profileID=@pProfileID and IsDeleted = 0 AND IsActive = 1)
				BEGIN
					
						UPDATE Profile.tblSeller
						SET [logo]=@pLogo
						WHERE profileID=@pProfileID

						Insert into tblLogTimeline
						(profileID,dateCreated,dateModified,isActive,isDeleted,description)
						Values (@pProfileID,GETDATE(),GETDATE(),1,0,'logo updated.')

				
				END 
	END TRY
	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Profile].[uspSetAdminUserActive]    Script Date: 12/29/2019 3:46:39 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 20/03/2018
-- Description:	
-- Exec [Profile].[uspSetAdminUserActive] 1,1,0

-- =============================================
CREATE PROCEDURE [Profile].[uspSetAdminUserActive] 
    @pProfileID	int	 
   ,@pAdminProfileID int
   ,@pIsActive		bit
AS
BEGIN
    DECLARE	@vActive nvarchar(max), 
			@vName nvarchar(max),
			@vAdminName nvarchar(max)

	set @vActive='active'	
	BEGIN TRY
    if(@pIsActive=0)
	begin
		set @vActive='inactive'		
	end


	   
    IF ISNULL(@pProfileID,0) > 0
	BEGIN
	    SELECT @vName=username from  [Profile].[tblUser] where profileID=@pProfileID
		SELECT @vAdminName=firstName +' '+lastName from  [Profile].[tblUser] where profileID=@pAdminProfileID

		
					UPDATE [Profile].[tblUser]
					SET
					   isActive=@pIsActive
					  ,[dateModified] = GETDATE()
					  ,[modifiedBy] = @pAdminProfileID
					WHERE profileID=@pProfileID
	
					UPDATE [Profile].[tblUserRole]
					SET
					   isActive=@pIsActive
					  ,[dateModified] = GETDATE()
					WHERE profileID=@pProfileID and roleID=2
	

		
		 Insert into tblLogTimeline
				(profileID,dateCreated,dateModified,isActive,isDeleted,description)
				 Values (@pProfileID,GETDATE(),GETDATE(),1,0,@vAdminName+' marked admin user <b>'+ @vName +'</b> profile ' +@vActive +'.')
	END
	
	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
/****** Object:  StoredProcedure [Profile].[uspUpdateAdminProfile]    Script Date: 12/29/2019 3:46:39 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:Saadia Nada
-- Create date: 28/04/2018
-- Description:	Admin Create New and Edit Record
-- Exec [Profile].[uspInsertUpdateAdminUser]

-- =============================================
CREATE PROCEDURE [Profile].[uspUpdateAdminProfile]

            @pProfileID	     int=null
		   ,@pUsername		 nvarchar(250)=null
           ,@pFirstName		 nvarchar(500)
           ,@pLastName		 nvarchar(500)=NULL
           ,@pMobile		 nvarchar(100)=NULL
		   ,@pProfilePhoto    nvarchar(500)=null
           ,@pEmail			  nvarchar(500)=null
		   ,@pModifiedby	  nvarchar(500)=null
           --,@pAddress		 as Profile.UserAddress Readonly

AS
BEGIN
	BEGIN TRY
     
	DECLARE @vInvalidity int=1,@vRoleID int,@isValid bit=1

	--@vInvalidity 4 Email Already Exists
	--@vInvalidity 5 Username Already Exists  
	--@vInvalidity 6 Username  Email Already Exists  
	--@vInvalidity 1  Success

    IF ISNULL(@pProfileID,0) > 0
	BEGIN
	   
	   IF EXISTS(select * from Profile.tblUser where email=@pEmail and profileID!=@pProfileID and isActive=1 and isDeleted=0)
	   BEGIN
				SET  @isValid=0
				SET  @vInvalidity=4
	   END
	   IF EXISTS(select * from Profile.tblUser where username=@pUsername and profileID!=@pProfileID and isActive=1 and isDeleted=0)
	   BEGIN
				SET  @isValid=0
				if(@vInvalidity=4)
				BEGIN
					SET  @vInvalidity=6
				END 
				ELSE
				BEGIN
					SET  @vInvalidity=5
				END 
	   END

	   IF(@isValid=1)
	   BEGIN
				   UPDATE [Profile].[tblUser]
				   SET 
					   [firstName] = @pFirstName
					  ,[lastName] = @pLastName
					  ,[mobile] = @pMobile
					  ,[username]=@pUsername
					  ,[email]=@pEmail
					  ,[dateModified] =GETDATE()
					WHERE profileID=@pProfileID

					IF (ISNULL(@pProfilePhoto,'')<>'')
					BEGIN
						UPDATE [Profile].[tblUser]
						   SET [profilePhoto] = @pProfilePhoto
						WHERE profileID=@pProfileID
					END
	    END
		Insert into tblLogTimeline
					(profileID,dateCreated,dateModified,isActive,isDeleted,description)
				    Values (@pProfileID,GETDATE(),GETDATE(),1,0,'Admin user profile information updated.')

		Insert into tblLogTimeline
				(profileID,dateCreated,dateModified,isActive,isDeleted,description)
				 SELECT profileID,GETDATE(),GETDATE(),1,0,'admin user <strong> '+ @pFirstname +' '+ @pLastname +'</strong> profile edited by '+ @pModifiedby + '.'
				 FROM Profile.tblUserRole where roleID in (1,2)

	END
	    select @vInvalidity as result;
	END TRY

	BEGIN CATCH	
			--ROLLBACK TRANSACTION
			INSERT INTO tblLogDBError
			SELECT
				ERROR_NUMBER() AS ERRORNUMBER, 
				ERROR_SEVERITY() AS ERRORSEVERITY, 
				ERROR_STATE() AS ERRORSTATE, 
				ERROR_LINE() AS ERRORLINE, 
				ERROR_PROCEDURE() AS ERRORPROCEDURE, 
				ERROR_MESSAGE() AS ExceptionDetail,
				1,
				0,
				GETDATE(), 
				GETDATE(), 
				CONVERT(SYSNAME , USER_NAME())AS DBUSERNAME, 
				CONVERT(SYSNAME, SUSER_SNAME()) AS SYSUSERNAME

				RETURN ERROR_NUMBER()
		END CATCH
END



GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N's' , @level0type=N'SCHEMA',@level0name=N'Lookup', @level1type=N'TABLE',@level1name=N'tblRequestStatus'
GO
